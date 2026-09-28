import type { TwitchTrace } from "../simple-muscle-twitch/twitch-model";

export const FATIGUE_WINDOW_MS = 500;
export const FATIGUE_PLAYBACK_MS = 720;
export const FATIGUE_MAX_FORCE = 12;
export const FATIGUE_RUN_LIMIT = 70;

const LATENCY_MS = 10;
const CONTRACTION_MS = 40;
const SAMPLE_STEP_MS = 2;

export type FatigueTrace = TwitchTrace & {
  stimulusNumber: number;
  fatigueLevel: number;
  residualForce: number;
};

function recruitmentAt(voltage: number) {
  const threshold = 0.3;
  const maximalVoltage = 4;

  if (voltage < threshold) return 0;
  const normalized = Math.min(
    1,
    (voltage - threshold) / (maximalVoltage - threshold),
  );
  return 0.08 + 0.92 * (
    (1 - Math.exp(-2.6 * normalized)) / (1 - Math.exp(-2.6))
  );
}

function fatigueAt(stimulusNumber: number) {
  return Math.min(
    1,
    Math.max(0, (stimulusNumber - 5) / (FATIGUE_RUN_LIMIT - 5)),
  );
}

function forceProfileAt(
  time: number,
  peakForce: number,
  residualForce: number,
  fatigueLevel: number,
) {
  if (time < LATENCY_MS) return 0;
  const activeTime = time - LATENCY_MS;

  if (activeTime <= CONTRACTION_MS) {
    const progress = activeTime / CONTRACTION_MS;
    return peakForce * Math.sin((progress * Math.PI) / 2);
  }

  const relaxationMs = 54 + fatigueLevel * 142;
  if (activeTime <= CONTRACTION_MS + relaxationMs) {
    const progress = (activeTime - CONTRACTION_MS) / relaxationMs;
    const eased = 0.5 + Math.cos(progress * Math.PI) / 2;
    const earlyUndershoot = -0.7 * (1 - fatigueLevel) * Math.sin(progress * Math.PI);
    return residualForce + (peakForce - residualForce) * eased + earlyUndershoot;
  }

  const recoveryTime = activeTime - CONTRACTION_MS - relaxationMs;
  const recovery = 1 - Math.exp(-recoveryTime / 55);
  const undershoot = -0.18 * (1 - fatigueLevel) * (1 - recovery);
  return residualForce + undershoot;
}

export function createFatigueTrace(
  stimulusNumber: number,
  voltage: number,
): FatigueTrace {
  const fatigueLevel = fatigueAt(stimulusNumber);
  const recruitment = recruitmentAt(voltage);
  const beneficialFactor = stimulusNumber <= 5
    ? 0.82 + stimulusNumber * 0.06
    : 1.12 * Math.exp(-(stimulusNumber - 5) / 42);
  const peakForce = Math.max(
    0,
    9.4 * recruitment * Math.max(0.2, beneficialFactor),
  );
  const residualForce = recruitment * 2 * Math.pow(fatigueLevel, 1.35);
  const relaxation = Math.round(54 + fatigueLevel * 142);
  const samples = Array.from(
    { length: FATIGUE_WINDOW_MS / SAMPLE_STEP_MS + 1 },
    (_, index) => {
      const time = index * SAMPLE_STEP_MS;
      return {
        time,
        force: forceProfileAt(
          time,
          peakForce,
          residualForce,
          fatigueLevel,
        ),
      };
    },
  );

  return {
    id: stimulusNumber,
    stimulusNumber,
    fatigueLevel,
    residualForce,
    voltage,
    mode: "indirect",
    peakForce,
    latency: LATENCY_MS,
    contraction: CONTRACTION_MS,
    relaxation,
    samples,
  };
}

export function fatigueStage(stimulusNumber: number) {
  if (stimulusNumber === 0) return "Preparation ready";
  if (stimulusNumber <= 5) return "Beneficial effect";
  if (stimulusNumber < 18) return "Progressive fatigue";
  return "Fatigue with contraction remainder";
}

