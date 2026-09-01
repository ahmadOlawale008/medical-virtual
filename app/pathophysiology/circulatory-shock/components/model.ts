export type ShockModel = {
  volumeLoss: number;
  pumpFailure: number;
  vasodilation: number;
  obstruction: number;
};

export type ShockResults = {
  heartRate: number;
  strokeVolume: number;
  cardiacOutput: number;
  svr: number;
  map: number;
  cvp: number;
  oxygenDelivery: number;
  lactate: number;
  urineOutput: number;
  perfusion: number;
};

export const shockPresets: Record<string, ShockModel> = {
  Normal: { volumeLoss: 2, pumpFailure: 2, vasodilation: 2, obstruction: 0 },
  Hypovolemic: { volumeLoss: 70, pumpFailure: 8, vasodilation: 5, obstruction: 0 },
  Cardiogenic: { volumeLoss: 5, pumpFailure: 76, vasodilation: 8, obstruction: 0 },
  Distributive: { volumeLoss: 18, pumpFailure: 8, vasodilation: 78, obstruction: 0 },
  Obstructive: { volumeLoss: 5, pumpFailure: 12, vasodilation: 5, obstruction: 78 },
};

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function calculateShock(model: ShockModel): ShockResults {
  const preload = clamp(
    1 - model.volumeLoss * 0.009 - model.obstruction * 0.006,
    0.16,
    1,
  );
  const contractility = clamp(1 - model.pumpFailure * 0.0095, 0.16, 1);
  const outflow = clamp(1 - model.obstruction * 0.0093, 0.18, 1);
  const heartRate = clamp(
    72 + model.volumeLoss * 0.52 + model.pumpFailure * 0.34 + model.vasodilation * 0.42,
    62,
    145,
  );
  const strokeVolume = clamp(78 * preload * contractility * outflow, 12, 82);
  const cardiacOutput = clamp((heartRate * strokeVolume) / 1000, 1.2, 7.2);
  const compensatoryTone = model.volumeLoss * 0.48 + model.pumpFailure * 0.36;
  const svr = clamp(980 + compensatoryTone * 12 - model.vasodilation * 11.5, 260, 1900);
  const map = clamp((cardiacOutput * svr) / 80 + 4, 24, 112);
  const perfusion = clamp((map / 90) * (cardiacOutput / 5.2) * 100, 12, 105);
  const oxygenDelivery = clamp(cardiacOutput * 190, 190, 1250);

  return {
    heartRate,
    strokeVolume,
    cardiacOutput,
    svr,
    map,
    cvp: clamp(5 - model.volumeLoss * 0.045 + model.pumpFailure * 0.085 + model.obstruction * 0.1, 1, 18),
    oxygenDelivery,
    lactate: clamp(1.1 + Math.pow(Math.max(0, 82 - perfusion) / 28, 1.35), 0.8, 8.5),
    urineOutput: clamp(1.1 * (perfusion / 100), 0.12, 1.25),
    perfusion,
  };
}

export function getShockStatus(results: ShockResults) {
  if (results.map < 55 || results.lactate >= 4) return "Critical tissue hypoperfusion";
  if (results.map < 65 || results.lactate >= 2) return "Decompensated circulatory shock";
  if (results.perfusion < 80) return "Compensated low-flow state";
  return "Systemic perfusion preserved";
}

export function getDominantShock(model: ShockModel) {
  const mechanisms = [
    ["Hypovolemic", model.volumeLoss],
    ["Cardiogenic", model.pumpFailure],
    ["Distributive", model.vasodilation],
    ["Obstructive", model.obstruction],
  ] as const;

  return [...mechanisms].sort((a, b) => b[1] - a[1])[0][0];
}
