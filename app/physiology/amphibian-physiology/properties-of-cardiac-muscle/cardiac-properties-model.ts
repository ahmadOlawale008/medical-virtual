export const PROPERTY_SAMPLE_MS = 20;

export type CardiacExperiment = "extrasystole" | "heart-block" | "all-or-none" | "staircase" | "subliminal-summation";
export type PropertySettings = { stimulusStrength: number; stimulusInterval: number; ligatureStage: number };
export type PropertySample = { time: number; force: number };

export const experiments = [
  { id: "extrasystole", number: 1, title: "Extra systole and compensatory pause", note: "The third wave is premature, followed by a compensatory pause and gradual recovery." },
  { id: "heart-block", number: 2, title: "Heart block: Stannius ligatures", note: "Two sequential four-cycle pauses demonstrate the first and second Stannius ligatures." },
  { id: "all-or-none", number: 3, title: "All-or-none law", note: "The first subthreshold stimulus gives no contraction; later threshold stimuli give complete responses." },
  { id: "staircase", number: 4, title: "Staircase phenomenon", note: "The first four contractions increase progressively to full amplitude." },
  { id: "subliminal-summation", number: 5, title: "Summation of subliminal stimuli", note: "A threshold beat is followed by a gap, then two responses from summated subliminal stimuli." },
] satisfies Array<{ id: CardiacExperiment; number: number; title: string; note: string }>;

const smooth = (value: number) => (1 - Math.cos(value * Math.PI)) / 2;

function normalWave(phase: number) {
  if (phase < 0) return 3;
  if (phase < 0.16) return 3 - 2 * smooth(phase / 0.16);
  if (phase < 0.32) return 1 + smooth((phase - 0.16) / 0.16);
  if (phase < 0.4) return 2;
  if (phase < 0.56) return 2 - 2 * smooth((phase - 0.4) / 0.16);
  return 3 * smooth((phase - 0.56) / 0.44);
}

export type PropertyState = { force: number; phase: number; cycleIndex: number; heartRate: number; silent: boolean; complete: boolean; ligature1: boolean; ligature2: boolean };

export function getPropertyState(timeMs: number, experiment: CardiacExperiment): PropertyState {
  let cycleIndex = 0;
  let phase = 0;
  let heartRate = experiment === "heart-block" ? 36 : 24;
  let complete = false;

  if (experiment === "heart-block") {
    const period1 = 60_000 / 36;
    const split1 = 8 * period1;
    const period2 = 60_000 / 24;
    const split2 = split1 + 8 * period2;
    if (timeMs < split1) {
      cycleIndex = Math.floor(timeMs / period1);
      phase = (timeMs % period1) / period1;
    } else if (timeMs < split2) {
      const relative = timeMs - split1;
      cycleIndex = 8 + Math.floor(relative / period2);
      phase = (relative % period2) / period2;
      heartRate = 24;
    } else {
      const period3 = 60_000 / 12;
      const relative = timeMs - split2;
      cycleIndex = 16 + Math.floor(relative / period3);
      phase = (relative % period3) / period3;
      heartRate = 12;
    }
    complete = cycleIndex >= 25;
  } else if (experiment === "all-or-none") {
    const beatMs = 60_000 / 24;
    const cycleDuration = beatMs + 4_000;
    cycleIndex = Math.floor(timeMs / cycleDuration);
    const timeInCycle = timeMs % cycleDuration;
    phase = timeInCycle < beatMs ? timeInCycle / beatMs : -1;
    complete = cycleIndex >= 4;
  } else {
    const period = 60_000 / 24;
    cycleIndex = Math.floor(timeMs / period);
    phase = (timeMs % period) / period;
    complete = cycleIndex >= (experiment === "subliminal-summation" ? 5 : 10);
  }

  let force = normalWave(phase);
  if (experiment === "extrasystole") {
    if (cycleIndex === 2) {
      if (phase < 0.16) force = 3 - 5 * smooth(phase / 0.16);
      else if (phase < 0.32) force = -2 + 5 * smooth((phase - 0.16) / 0.16);
      else force = 3;
    } else {
      const scale = ({ 3: 1 / 3, 4: 5 / 9, 5: 7 / 9, 6: 1 } as Record<number, number>)[cycleIndex];
      if (scale !== undefined) force = 3 - (3 - force) * scale;
    }
  } else if (experiment === "staircase") {
    const scale = ({ 0: 0.4, 1: 0.6, 2: 0.8, 3: 0.9 } as Record<number, number>)[cycleIndex] ?? 1;
    force = 3 - (3 - force) * scale;
  } else if (experiment === "subliminal-summation") {
    if (cycleIndex >= 1 && cycleIndex <= 3) force = 3;
  } else if (experiment === "heart-block") {
    if ((cycleIndex >= 4 && cycleIndex <= 7) || (cycleIndex >= 12 && cycleIndex <= 15)) force = 3;
  } else if (experiment === "all-or-none") {
    force = cycleIndex === 0 || phase < 0 ? 3 : normalWave(phase);
    if (cycleIndex === 0 && phase >= 0 && phase < 0.02) force -= 0.6;
  }

  const silent = experiment === "heart-block"
    ? (cycleIndex >= 4 && cycleIndex <= 7) || (cycleIndex >= 12 && cycleIndex <= 15)
    : experiment === "subliminal-summation"
      ? cycleIndex >= 1 && cycleIndex <= 3
      : experiment === "all-or-none" && (cycleIndex === 0 || phase < 0);

  return { force, phase, cycleIndex, heartRate, silent, complete, ligature1: experiment === "heart-block" && cycleIndex >= 4, ligature2: experiment === "heart-block" && cycleIndex >= 12 };
}

export function stimulusIsActive(timeMs: number, experiment: CardiacExperiment) {
  const state = getPropertyState(timeMs, experiment);
  if (experiment === "subliminal-summation") return timeMs < 150 || (state.cycleIndex === 1 && state.phase < 0.06) || (state.cycleIndex >= 4 && timeMs % 250 < 100);
  return state.phase >= 0 && state.phase < 0.025;
}
