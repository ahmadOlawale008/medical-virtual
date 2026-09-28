import type { TwitchTrace } from "../simple-muscle-twitch/twitch-model";

export const TETANUS_WINDOW_MS = 3000;
export const TETANUS_MAX_FORCE = 4;

const LATENT_PERIOD_MS = 10;
const CONTRACTION_MS = 40;
const RELAXATION_MS = 140;
const SAMPLE_STEP_MS = 10;

export type TetanusPattern =
  | "Treppe"
  | "Clonus"
  | "Incomplete tetanus"
  | "Complete tetanus";

export type TetanusTrace = TwitchTrace & {
  frequency: number;
  pattern: TetanusPattern;
  stimulusTimes: number[];
};

export function getTetanusPattern(frequency: number): TetanusPattern {
  if (frequency <= 10) return "Treppe";
  if (frequency <= 20) return "Clonus";
  if (frequency <= 35) return "Incomplete tetanus";
  return "Complete tetanus";
}

function singleTwitch(timeAfterStimulus: number) {
  if (timeAfterStimulus < LATENT_PERIOD_MS) return 0;
  const activeTime = timeAfterStimulus - LATENT_PERIOD_MS;

  if (activeTime < CONTRACTION_MS) {
    return Math.sin((activeTime / CONTRACTION_MS) * (Math.PI / 2));
  }
  if (activeTime < CONTRACTION_MS + RELAXATION_MS) {
    const progress = (activeTime - CONTRACTION_MS) / RELAXATION_MS;
    return (1 + Math.cos(progress * Math.PI)) / 2;
  }
  return 0;
}

export function calculateTetanusForce(
  timeMs: number,
  stimulusTimes: readonly number[],
) {
  let summedForce = 0;

  stimulusTimes.forEach((stimulusTime, index) => {
    if (timeMs < stimulusTime) return;
    const treppeFactor = Math.min(1.5, 1 + index * 0.15);
    summedForce += singleTwitch(timeMs - stimulusTime) * treppeFactor;
  });

  return Math.min(TETANUS_MAX_FORCE, summedForce);
}

export function createTetanusTrace(
  id: number,
  frequency: number,
): TetanusTrace {
  const interval = 1000 / frequency;
  const stimulusTimes = Array.from(
    { length: Math.floor(TETANUS_WINDOW_MS / interval) + 1 },
    (_, index) => index * interval,
  );
  const samples = Array.from(
    { length: TETANUS_WINDOW_MS / SAMPLE_STEP_MS + 1 },
    (_, index) => {
      const time = index * SAMPLE_STEP_MS;
      return {
        time,
        force: calculateTetanusForce(time, stimulusTimes),
      };
    },
  );
  const peakForce = Math.max(...samples.map((sample) => sample.force));

  return {
    id,
    frequency,
    pattern: getTetanusPattern(frequency),
    stimulusTimes,
    samples,
    voltage: 4,
    mode: "indirect",
    peakForce,
    latency: LATENT_PERIOD_MS,
    contraction: CONTRACTION_MS,
    relaxation: RELAXATION_MS,
  };
}

export function describeTetanusPattern(pattern: TetanusPattern) {
  switch (pattern) {
    case "Treppe":
      return "Separate contractions show a progressive staircase increase in force.";
    case "Clonus":
      return "Repeated contractions partially relax between stimuli.";
    case "Incomplete tetanus":
      return "Temporal summation produces a sustained but oscillating contraction.";
    case "Complete tetanus":
      return "Individual twitches fuse into a smooth sustained contraction.";
  }
}
