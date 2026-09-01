export type DkaModel = {
  insulinDeficiency: number;
  stressHormones: number;
  dehydration: number;
};

export type DkaResults = {
  glucose: number;
  ketones: number;
  bicarbonate: number;
  ph: number;
  anionGap: number;
  potassium: number;
  sodium: number;
  effectiveOsmolality: number;
  cellularUptake: number;
  lipolysis: number;
  ketogenesis: number;
  osmoticDiuresis: number;
};

export const dkaPresets: Record<string, DkaModel> = {
  Normal: {
    insulinDeficiency: 4,
    stressHormones: 5,
    dehydration: 3,
  },
  "Evolving DKA": {
    insulinDeficiency: 68,
    stressHormones: 46,
    dehydration: 34,
  },
  "Severe DKA": {
    insulinDeficiency: 96,
    stressHormones: 82,
    dehydration: 82,
  },
};

export function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

export function calculateDka(model: DkaModel): DkaResults {
  const insulin = model.insulinDeficiency / 100;
  const stress = model.stressHormones / 100;
  const dehydration = model.dehydration / 100;
  const cellularUptake = clamp(100 - model.insulinDeficiency * 0.92, 5, 100);
  const lipolysis = clamp(model.insulinDeficiency * 0.72 + model.stressHormones * 0.34, 2, 100);
  const ketogenesis = clamp((lipolysis - 12) * 1.05 + model.stressHormones * 0.18, 0, 100);
  const glucose = clamp(
    92 + insulin * 255 + stress * 92 + dehydration * 58,
    75,
    560,
  );
  const ketones = clamp(0.15 + ketogenesis * 0.082, 0.1, 9.2);
  const bicarbonate = clamp(
    24 - Math.max(0, ketones - 0.45) * 2.05 - dehydration * 2.2,
    5,
    25,
  );
  const ph = clamp(7.4 - (24 - bicarbonate) * 0.0235, 6.88, 7.42);
  const anionGap = clamp(12 + (24 - bicarbonate) * 0.82, 8, 30);
  const potassium = clamp(
    4.1 + insulin * 0.9 + Math.max(0, 7.36 - ph) * 3.1,
    3.5,
    6.5,
  );
  const sodium = clamp(140 - ((glucose - 100) / 100) * 1.6 + dehydration * 2, 130, 146);
  const effectiveOsmolality = 2 * sodium + glucose / 18;
  const osmoticDiuresis = clamp((glucose - 150) / 3.2 + ketogenesis * 0.24, 0, 100);

  return {
    glucose,
    ketones,
    bicarbonate,
    ph,
    anionGap,
    potassium,
    sodium,
    effectiveOsmolality,
    cellularUptake,
    lipolysis,
    ketogenesis,
    osmoticDiuresis,
  };
}

export function getDkaState(results: DkaResults) {
  if (results.ketones >= 6 || results.ph < 7 || results.bicarbonate < 10) {
    return "Severe ketoacidosis";
  }
  if (results.ketones >= 3 && (results.ph < 7.3 || results.bicarbonate < 18)) {
    return results.ph <= 7.25 || results.bicarbonate < 15
      ? "Moderate ketoacidosis"
      : "Mild ketoacidosis";
  }
  if (results.ketones >= 1 || results.glucose >= 200) {
    return "Evolving ketotic state";
  }
  return "Metabolic homeostasis preserved";
}
