import type { HeartFailureModel, HemodynamicResults } from "./model";

export default function ResultsPanel({ model, results }: { model: HeartFailureModel; results: HemodynamicResults }) {
  const measurements = [
    ["Ejection fraction", `${results.ejectionFraction.toFixed(0)}%`, results.ejectionFraction < 40],
    ["End-diastolic volume", `${results.endDiastolicVolume.toFixed(0)} mL`, results.endDiastolicVolume > 150],
    ["End-systolic volume", `${results.endSystolicVolume.toFixed(0)} mL`, results.endSystolicVolume > 70],
    ["Stroke volume", `${results.strokeVolume.toFixed(0)} mL`, results.strokeVolume < 50],
    ["Cardiac output", `${results.cardiacOutput.toFixed(1)} L/min`, results.cardiacOutput < 4],
    ["Mean pressure", `${results.meanPressure.toFixed(0)} mmHg`, results.meanPressure < 65],
    ["LV filling pressure", `${results.fillingPressure.toFixed(0)} mmHg`, results.fillingPressure >= 18],
  ] as const;
  const effects = [
    ["Sympathetic response", model.heartRate > 85 ? "Rate supports output but raises myocardial demand." : "Minimal activation."],
    ["RAAS / fluid retention", model.volume > 90 ? "Preload rises together with congestion risk." : "Volume remains near reference."],
    ["Vasoconstriction", model.resistance > 1350 ? "MAP is defended at the cost of LV afterload." : "Afterload is not markedly elevated."],
  ];

  return (
    <aside className="bg-background p-5 text-foreground">
      <p className="text-[11px] font-semibold tracking-[.1em] text-primary">LIVE MEASUREMENTS</p>
      <dl className="mt-4 divide-y divide-border border-y border-border">
        {measurements.map(([term, value, abnormal]) => (
          <div key={term} className="py-3">
            <div className="flex justify-between gap-3">
              <dt className="text-xs text-muted">{term}</dt>
              <span className={`text-[10px] font-semibold ${abnormal ? "text-secondary" : "text-primary"}`}>{abnormal ? "ABNORMAL" : "IN RANGE"}</span>
            </div>
            <dd className="mt-1 font-accent text-xl font-bold tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-5 text-[11px] font-semibold tracking-[.1em] text-primary">COMPENSATION EFFECTS</p>
      <div className="mt-3 grid gap-2">
        {effects.map(([title, text]) => (
          <div key={title} className="rounded-md border border-border bg-white p-3">
            <p className="text-xs font-semibold">{title}</p>
            <p className="mt-1 text-xs leading-5 text-muted">{text}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}
