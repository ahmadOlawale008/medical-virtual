import type { TwitchTrace } from "../simple-muscle-twitch/twitch-model";

export const TWO_STIMULI_WINDOW_MS = 300;
export const TWO_STIMULI_PLAYBACK_MS = 1700;
export const TWO_STIMULI_MAX_FORCE = 12;

const LATENT_MS = 10;
const CONTRACTION_MS = 40;
const RELAXATION_MS = 90;
const BASE_FORCE = 6;

export type StimulusPeriod =
  | "latent"
  | "contraction"
  | "early-relaxation"
  | "late-relaxation";

export type TwoStimuliTrace = TwitchTrace & {
  interval: number;
  period: StimulusPeriod;
  secondStimulusAt: number;
};

export const PERIOD_OPTIONS: Array<{
  value: StimulusPeriod;
  title: string;
  interval: number;
  detail: string;
}> = [
  {
    value: "latent",
    title: "Latent period",
    interval: 8,
    detail: "S₂ occurs before the first contraction is visible.",
  },
  {
    value: "contraction",
    title: "Contraction period",
    interval: 32,
    detail: "S₂ adds force while the first twitch is rising.",
  },
  {
    value: "early-relaxation",
    title: "Early relaxation",
    interval: 72,
    detail: "S₂ produces a second rise before full relaxation.",
  },
  {
    value: "late-relaxation",
    title: "Late relaxation",
    interval: 125,
    detail: "S₂ produces two clearly separated contractions.",
  },
];

export function getPeriodForInterval(interval: number): StimulusPeriod {
  if (interval < LATENT_MS) return "latent";
  if (interval < LATENT_MS + CONTRACTION_MS) return "contraction";
  if (interval < LATENT_MS + CONTRACTION_MS + RELAXATION_MS / 2) {
    return "early-relaxation";
  }
  return "late-relaxation";
}

export function singleTwitchForce(timeSinceStimulus: number) {
  if (timeSinceStimulus < LATENT_MS) return 0;
  const activeTime = timeSinceStimulus - LATENT_MS;

  if (activeTime <= CONTRACTION_MS) {
    return BASE_FORCE * (0.5 - Math.cos((activeTime / CONTRACTION_MS) * Math.PI) / 2);
  }
  if (activeTime <= CONTRACTION_MS + RELAXATION_MS) {
    const progress = (activeTime - CONTRACTION_MS) / RELAXATION_MS;
    return BASE_FORCE * (1 + Math.cos(progress * Math.PI)) / 2;
  }
  return 0;
}

export function twoStimuliForce(timeMs: number, interval: number) {
  return Math.min(
    TWO_STIMULI_MAX_FORCE,
    singleTwitchForce(timeMs) + singleTwitchForce(timeMs - interval),
  );
}

export function createTwoStimuliTrace(
  id: number,
  interval: number,
): TwoStimuliTrace {
  const samples = Array.from(
    { length: TWO_STIMULI_WINDOW_MS + 1 },
    (_, time) => ({ time, force: twoStimuliForce(time, interval) }),
  );
  const peakForce = Math.max(...samples.map((sample) => sample.force));

  return {
    id,
    interval,
    period: getPeriodForInterval(interval),
    secondStimulusAt: interval,
    samples,
    voltage: 4,
    mode: "indirect",
    peakForce,
    latency: LATENT_MS,
    contraction: CONTRACTION_MS,
    relaxation: RELAXATION_MS,
  };
}

export function describeTwoStimuli(trace: TwoStimuliTrace) {
  switch (trace.period) {
    case "latent":
      return "The two stimuli are close together, so the recorded response appears as one larger twitch.";
    case "contraction":
      return "The second response is superimposed on contraction, producing temporal summation.";
    case "early-relaxation":
      return "The second stimulus interrupts relaxation and creates a second rise in tension.";
    case "late-relaxation":
      return "The muscle has nearly relaxed before S₂, so two contractions are distinguishable.";
  }
}
