import type { DkaResults } from "./model";

type Result = {
  term: string;
  value: string;
  abnormal: boolean;
};

export default function ResultsPanel({ results }: { results: DkaResults }) {
  const values: Result[] = [
    { term: "Glucose", value: `${results.glucose.toFixed(0)} mg/dL`, abnormal: results.glucose >= 200 },
    { term: "β-hydroxybutyrate", value: `${results.ketones.toFixed(1)} mmol/L`, abnormal: results.ketones >= 3 },
    { term: "Venous pH", value: results.ph.toFixed(2), abnormal: results.ph < 7.3 },
    { term: "HCO₃⁻", value: `${results.bicarbonate.toFixed(0)} mmol/L`, abnormal: results.bicarbonate < 18 },
    { term: "Anion gap", value: `${results.anionGap.toFixed(0)} mmol/L`, abnormal: results.anionGap > 16 },
    { term: "Potassium", value: `${results.potassium.toFixed(1)} mmol/L`, abnormal: results.potassium > 5.2 },
    { term: "Sodium", value: `${results.sodium.toFixed(0)} mmol/L`, abnormal: results.sodium < 135 },
    { term: "Effective Osm", value: `${results.effectiveOsmolality.toFixed(0)} mOsm/kg`, abnormal: results.effectiveOsmolality > 300 },
  ];

  const criteria = [
    ["D", results.glucose >= 200, "Diabetes / glucose ≥200"],
    ["K", results.ketones >= 3, "Ketones ≥3.0 mmol/L"],
    ["A", results.ph < 7.3 || results.bicarbonate < 18, "Acidosis present"],
  ] as const;

  return (
    <aside className="bg-background p-5 text-foreground">
      <p className="text-[11px] font-semibold tracking-[.1em] text-primary">
        METABOLIC PANEL
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
        DKA DIAGNOSTIC TRIAD
      </p>
      <div className="mt-3 space-y-2 rounded-md border border-border bg-white p-3">
        {criteria.map(([letter, met, label]) => (
          <div key={letter} className="flex items-center gap-3 text-xs">
            <span className={`grid size-7 shrink-0 place-items-center rounded-full font-accent font-bold ${met ? "bg-secondary text-[#2a160d]" : "bg-primary-soft text-primary"}`}>
              {letter}
            </span>
            <span className="text-muted">{label}</span>
            <strong className={`ml-auto text-[9px] ${met ? "text-secondary" : "text-primary"}`}>
              {met ? "MET" : "NOT MET"}
            </strong>
          </div>
        ))}
      </div>
    </aside>
  );
}
