export type AkiModel = {
  perfusionLoss: number;
  tubularDamage: number;
  obstruction: number;
};

export type AkiResults = {
  gfr: number;
  creatinine: number;
  bun: number;
  bunCreatinineRatio: number;
  urineOutput: number;
  fractionalSodiumExcretion: number;
  potassium: number;
  urineSodium: number;
};

export const akiPresets: Record<string, AkiModel> = {
  Normal: { perfusionLoss: 2, tubularDamage: 1, obstruction: 0 },
  Prerenal: { perfusionLoss: 72, tubularDamage: 8, obstruction: 0 },
  "Intrinsic · ATN": { perfusionLoss: 25, tubularDamage: 78, obstruction: 0 },
  Postrenal: { perfusionLoss: 8, tubularDamage: 18, obstruction: 82 },
};

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function calculateKidneyFunction(model: AkiModel): AkiResults {
  const perfusionEffect = model.perfusionLoss * 0.68;
  const tubularEffect = model.tubularDamage * 0.58;
  const obstructionEffect = model.obstruction * 0.72;
  const combinedInjury = clamp(
    perfusionEffect + tubularEffect + obstructionEffect,
    0,
    105,
  );
  const gfr = clamp(122 - combinedInjury * 1.05, 8, 125);
  const filtrationFraction = 120 / gfr;
  const creatinine = clamp(0.85 * Math.pow(filtrationFraction, 0.84), 0.7, 9.2);
  const prerenalDominance = clamp(
    (model.perfusionLoss - model.tubularDamage * 0.45) / 100,
    0,
    1,
  );
  const bunCreatinineRatio = clamp(
    14 + prerenalDominance * 14 + model.obstruction * 0.035,
    10,
    30,
  );
  const bun = clamp(creatinine * bunCreatinineRatio, 8, 110);
  const urineOutput = clamp(
    1.25 -
    model.perfusionLoss * 0.008 -
    model.tubularDamage * 0.005 -
    model.obstruction * 0.009,
    0.08,
    1.4,
  );
  const fractionalSodiumExcretion = clamp(
    0.75 - model.perfusionLoss * 0.005 + model.tubularDamage * 0.031,
    0.25,
    4.5,
  );

  return {
    gfr,
    creatinine,
    bun,
    bunCreatinineRatio,
    urineOutput,
    fractionalSodiumExcretion,
    potassium: clamp(4 + (120 - gfr) * 0.017 + model.tubularDamage * 0.004, 3.7, 6.7),
    urineSodium: clamp(14 - model.perfusionLoss * 0.06 + model.tubularDamage * 0.54, 7, 65),
  };
}

export function getAkiStatus(results: AkiResults) {
  if (results.gfr < 25 || results.potassium >= 6) return "Severe loss of renal clearance";
  if (results.gfr < 60) return "Marked reduction in filtration";
  if (results.gfr < 90) return "Early decline in kidney function";
  return "Filtration and urine flow preserved";
}

export function getDominantMechanism(model: AkiModel) {
  const mechanisms = [
    { name: "Prerenal hypoperfusion", value: model.perfusionLoss },
    { name: "Intrinsic tubular injury", value: model.tubularDamage },
    { name: "Postrenal obstruction", value: model.obstruction },
  ];

  return mechanisms.sort((a, b) => b.value - a.value)[0].name;
}
