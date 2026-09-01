export type HeartFailureModel = {
  contractility: number;
  heartRate: number;
  resistance: number;
  volume: number;
};

export type HemodynamicResults = {
  endDiastolicVolume: number;
  endSystolicVolume: number;
  strokeVolume: number;
  ejectionFraction: number;
  cardiacOutput: number;
  meanPressure: number;
  fillingPressure: number;
};

export const presets: Record<string, HeartFailureModel> = {
  Normal: { contractility: 82, heartRate: 70, resistance: 1100, volume: 75 },
  "Early HFrEF": { contractility: 48, heartRate: 82, resistance: 1250, volume: 88 },
  Compensated: { contractility: 38, heartRate: 96, resistance: 1450, volume: 104 },
  Decompensated: { contractility: 27, heartRate: 108, resistance: 1700, volume: 122 },
};

export function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

export function calculateHemodynamics(
  model: HeartFailureModel,
): HemodynamicResults {
  const preload = model.volume / 75;
  const afterload = model.resistance / 1100;
  const strokeVolume = clamp(
    (72 * (model.contractility / 82) * (0.72 + preload * 0.28)) /
      Math.pow(afterload, 0.48) -
      Math.max(0, model.heartRate - 95) * 0.12,
    18,
    105,
  );
  const endDiastolicVolume = clamp(
    118 * preload + (82 - model.contractility) * 0.42,
    85,
    210,
  );

  return {
    endDiastolicVolume,
    endSystolicVolume: Math.max(10, endDiastolicVolume - strokeVolume),
    strokeVolume,
    ejectionFraction: clamp(
      (strokeVolume / endDiastolicVolume) * 100,
      12,
      75,
    ),
    cardiacOutput: (strokeVolume * model.heartRate) / 1000,
    meanPressure: clamp(
      ((strokeVolume * model.heartRate) / 1000) * model.resistance / 80 + 5,
      45,
      135,
    ),
    fillingPressure: clamp(
      7 +
        (model.volume - 75) * 0.22 +
        (82 - model.contractility) * 0.09,
      4,
      32,
    ),
  };
}

export function getHemodynamicStatus(results: HemodynamicResults) {
  if (results.fillingPressure >= 18) return "Pulmonary congestion";
  if (results.cardiacOutput < 4) return "Low-output state";
  if (results.ejectionFraction < 40) return "Reduced systolic function";
  return "Stable circulation";
}
