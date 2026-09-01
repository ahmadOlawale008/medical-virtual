export type StimulationMode = "indirect" | "direct";

export type TwitchTrace = {
  id: number;
  voltage: number;
  mode: StimulationMode;
  peakForce: number;
  latency: number;
  contraction: number;
  relaxation: number;
  riseProfile?: "cosine" | "sine";
  sustained?: boolean;
  samples?: ReadonlyArray<{ time: number; force: number }>;
};

export type StimulationParameters = {
  threshold: number;
  maximalVoltage: number;
  maximumForce: number;
};

export type StimulusPhase = "subthreshold" | "recruitment" | "maximal";

export const SIMPLE_TWITCH_WINDOW_MS = 500;
export const RECORDING_PLAYBACK_MS = 1600;

export function getStimulationParameters(
  mode: StimulationMode,
): StimulationParameters {
  return mode === "indirect"
    ? { threshold: 0.3, maximalVoltage: 4, maximumForce: 9.2 }
    : { threshold: 0.7, maximalVoltage: 6, maximumForce: 7.8 };
}

export function getStimulusPhase(
  voltage: number,
  mode: StimulationMode,
): StimulusPhase {
  const { threshold, maximalVoltage } = getStimulationParameters(mode);

  if (voltage < threshold) return "subthreshold";
  if (voltage >= maximalVoltage) return "maximal";
  return "recruitment";
}

export function createTwitchTrace(
  id: number,
  voltage: number,
  mode: StimulationMode,
): TwitchTrace {
  const { threshold, maximalVoltage, maximumForce } =
    getStimulationParameters(mode);
  const phase = getStimulusPhase(voltage, mode);
  const activation = Math.min(
    1,
    Math.max(0, (voltage - threshold) / (maximalVoltage - threshold)),
  );
  const recruitmentCurve =
    (1 - Math.exp(-2.6 * activation)) / (1 - Math.exp(-2.6));
  const recruitment = phase === "subthreshold"
    ? 0
    : phase === "maximal"
      ? 1
      : 0.08 + recruitmentCurve * 0.92;

  return {
    id,
    voltage,
    mode,
    peakForce: maximumForce * recruitment,
    latency: mode === "indirect" ? 10 : 6,
    contraction: 40,
    relaxation: 50,
  };
}

export function normalizedTwitchAt(timeMs: number, trace: TwitchTrace) {
  if (trace.samples && trace.samples.length > 0) {
    if (trace.peakForce === 0) return 0;
    if (timeMs <= trace.samples[0].time) {
      return trace.samples[0].force / trace.peakForce;
    }

    const finalSample = trace.samples[trace.samples.length - 1];
    if (timeMs >= finalSample.time) {
      return finalSample.force / trace.peakForce;
    }

    const sampleStep = trace.samples[1]?.time - trace.samples[0].time || 1;
    const lowerIndex = Math.min(
      trace.samples.length - 2,
      Math.max(0, Math.floor(timeMs / sampleStep)),
    );
    const lower = trace.samples[lowerIndex];
    const upper = trace.samples[lowerIndex + 1];
    const progress = (timeMs - lower.time) / (upper.time - lower.time);
    const force = lower.force + (upper.force - lower.force) * progress;
    return force / trace.peakForce;
  }

  if (trace.peakForce === 0 || timeMs < trace.latency) return 0;
  const contractionEnd = trace.latency + trace.contraction;
  const relaxationEnd = contractionEnd + trace.relaxation;

  if (timeMs <= contractionEnd) {
    const progress = (timeMs - trace.latency) / trace.contraction;
    if (trace.riseProfile === "sine") {
      return Math.sin((progress * Math.PI) / 2);
    }
    return 0.5 - Math.cos(progress * Math.PI) / 2;
  }
  if (trace.sustained) return 1;
  if (timeMs <= relaxationEnd) {
    const progress = (timeMs - contractionEnd) / trace.relaxation;
    return (1 + Math.cos(progress * Math.PI)) / 2;
  }
  return 0;
}

export function forceAtTime(timeMs: number, trace: TwitchTrace) {
  return normalizedTwitchAt(timeMs, trace) * trace.peakForce;
}
