import type { AkiModel, AkiResults } from "./model";
import { getDominantMechanism } from "./model";

type Result = {
  term: string;
  value: string;
  abnormal: boolean;
};

export default function ResultsPanel({
  model,
  results,
}: {
  model: AkiModel;
  results: AkiResults;
}) {
  const values: Result[] = [
    { term: "eGFR", value: `${results.gfr.toFixed(0)} mL/min`, abnormal: results.gfr < 90 },
    { term: "Creatinine", value: `${results.creatinine.toFixed(2)} mg/dL`, abnormal: results.creatinine > 1.2 },
    { term: "BUN", value: `${results.bun.toFixed(0)} mg/dL`, abnormal: results.bun > 20 },
    { term: "BUN : Cr", value: `${results.bunCreatinineRatio.toFixed(0)} : 1`, abnormal: results.bunCreatinineRatio > 20 },
    { term: "Urine output", value: `${results.urineOutput.toFixed(2)} mL/kg/h`, abnormal: results.urineOutput < 0.5 },
    { term: "FENa", value: `${results.fractionalSodiumExcretion.toFixed(1)}%`, abnormal: results.fractionalSodiumExcretion > 2 },
    { term: "Potassium", value: `${results.potassium.toFixed(1)} mmol/L`, abnormal: results.potassium > 5 },
    { term: "Urine Na⁺", value: `${results.urineSodium.toFixed(0)} mmol/L`, abnormal: results.urineSodium > 40 },
  ];

  return (
    <aside className="bg-background p-5 text-foreground">
      <p className="text-[11px] font-semibold tracking-[.1em] text-primary">
        RENAL FUNCTION
      </p>
      <dl className="mt-4 grid grid-cols-2 gap-x-4 border-y border-border">
        {values.map(({ term, value, abnormal }) => (
          <div key={term} className="border-b border-border py-3">
            <div className="flex justify-between gap-2">
              <dt className="text-xs text-muted">{term}</dt>
              <span className={`text-[9px] font-semibold ${abnormal ? "text-secondary" : "text-primary"}`}>
                {abnormal ? "ALTERED" : "IN RANGE"}
              </span>
            </div>
            <dd className="mt-1 font-accent text-base font-bold tabular-nums">
              {value}
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-5 text-[11px] font-semibold tracking-[.1em] text-primary">
        DOMINANT MECHANISM
      </p>
      <div className="mt-3 rounded-md border border-border bg-white p-4">
        <p className="text-sm font-semibold">{getDominantMechanism(model)}</p>
        <p className="mt-2 text-xs leading-5 text-muted">
          {model.tubularDamage >= Math.max(model.perfusionLoss, model.obstruction)
            ? "Tubular dysfunction reduces reabsorption and raises urinary sodium loss."
            : model.obstruction >= model.perfusionLoss
              ? "Back-pressure opposes filtration and progressively reduces urine flow."
              : "Reduced renal blood flow lowers glomerular pressure while sodium is retained."}
        </p>
      </div>
    </aside>
  );
}
