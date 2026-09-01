export type LungModel = {
  airwayNarrowing: number;
  elasticRecoilLoss: number;
  mucusLoad: number;
  gasExchangeLoss: number;
};

export type LungResults = {
  fev1: number;
  fvc: number;
  ratio: number;
  peakFlow: number;
  residualVolume: number;
  oxygenSaturation: number;
  carbonDioxide: number;
};

export const lungPresets: Record<string, LungModel> = {
  Normal: { airwayNarrowing: 5, elasticRecoilLoss: 3, mucusLoad: 4, gasExchangeLoss: 2 },
  "Chronic bronchitis": { airwayNarrowing: 58, elasticRecoilLoss: 18, mucusLoad: 76, gasExchangeLoss: 38 },
  Emphysema: { airwayNarrowing: 34, elasticRecoilLoss: 82, mucusLoad: 12, gasExchangeLoss: 72 },
  "Severe mixed COPD": { airwayNarrowing: 78, elasticRecoilLoss: 76, mucusLoad: 68, gasExchangeLoss: 82 },
};

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function calculateLungFunction(model: LungModel): LungResults {
  const obstruction = model.airwayNarrowing * 0.52 + model.mucusLoad * 0.22 + model.elasticRecoilLoss * 0.36;
  const airTrapping = model.elasticRecoilLoss * 0.58 + model.airwayNarrowing * 0.25;
  const fvc = clamp(4.8 - airTrapping * 0.015, 2.2, 5.2);
  const fev1 = clamp(4.0 - obstruction * 0.031, 0.55, 4.3);

  return {
    fev1,
    fvc,
    ratio: clamp((fev1 / fvc) * 100, 20, 88),
    peakFlow: clamp(590 - obstruction * 4.2, 90, 620),
    residualVolume: clamp(1.2 + airTrapping * 0.035, 1, 4.8),
    oxygenSaturation: clamp(98 - model.gasExchangeLoss * 0.095 - obstruction * 0.025, 82, 99),
    carbonDioxide: clamp(40 + obstruction * 0.035 + model.gasExchangeLoss * 0.04, 36, 58),
  };
}

export function getLungStatus(results: LungResults) {
  if (results.oxygenSaturation < 90) return "Severe obstruction with hypoxemia";
  if (results.ratio < 50) return "Marked expiratory flow limitation";
  if (results.ratio < 70) return "Obstructive ventilatory pattern";
  return "Flow and gas exchange preserved";
}
