import type { TwitchTrace } from "../simple-muscle-twitch/twitch-model";

export type StimulationPoint = "muscle" | "vertebral";

export type ConductionTrace = TwitchTrace & {
  point: StimulationPoint;
  label: "M-curve" | "V-curve";
  color: string;
};

export const CONDUCTION_WINDOW_MS = 300;
export const CONDUCTION_PLAYBACK_MS = 1500;
export const CONDUCTION_MAX_FORCE = 1.6;
export const NERVE_DISTANCE_CM = 4;

const profiles = {
  muscle: {
    latency: 15,
    contraction: 50,
    relaxation: 70,
    label: "M-curve" as const,
    color: "#2563eb",
  },
  vertebral: {
    latency: 35,
    contraction: 55,
    relaxation: 75,
    label: "V-curve" as const,
    color: "#60a5fa",
  },
};

export function createConductionTrace(
  id: number,
  point: StimulationPoint,
): ConductionTrace {
  const profile = profiles[point];
  const peakForce = 1.4 * (3.5 / 4);
  const samples = Array.from({ length: 151 }, (_, index) => {
    const time = (index / 150) * CONDUCTION_WINDOW_MS;
    return {
      time,
      force: conductionForceAt(time, peakForce, profile),
    };
  });

  return {
    id,
    voltage: 3.5,
    mode: "indirect",
    point,
    label: profile.label,
    color: profile.color,
    peakForce,
    latency: profile.latency,
    contraction: profile.contraction,
    relaxation: profile.relaxation,
    riseProfile: "sine",
    samples,
  };
}

function conductionForceAt(
  time: number,
  peakForce: number,
  profile: { latency: number; contraction: number; relaxation: number },
) {
  if (time < profile.latency) return 0;
  const responseTime = time - profile.latency;
  if (responseTime < profile.contraction) {
    return peakForce * Math.sin(
      (responseTime / profile.contraction) * (Math.PI / 2),
    );
  }
  if (responseTime < profile.contraction + profile.relaxation) {
    const progress = (responseTime - profile.contraction) / profile.relaxation;
    return peakForce * ((1 + Math.cos(progress * Math.PI)) / 2);
  }
  return 0;
}

export function calculateConductionVelocity(
  muscleTrace: ConductionTrace | undefined,
  vertebralTrace: ConductionTrace | undefined,
) {
  if (!muscleTrace || !vertebralTrace) return null;
  const latencyDifferenceMs = vertebralTrace.latency - muscleTrace.latency;
  if (latencyDifferenceMs <= 0) return null;
  return (NERVE_DISTANCE_CM / 100) / (latencyDifferenceMs / 1000);
}
