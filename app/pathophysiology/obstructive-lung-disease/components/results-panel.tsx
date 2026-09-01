import type { LungModel, LungResults } from "./model";

export default function ResultsPanel({ model, results }: { model: LungModel; results: LungResults }) {
  const values = [
    ["FEV₁", `${results.fev1.toFixed(2)} L`, results.fev1 < 2.5],
    ["FVC", `${results.fvc.toFixed(2)} L`, results.fvc < 3.5],
    ["FEV₁ / FVC", `${results.ratio.toFixed(0)}%`, results.ratio < 70],
    ["Peak flow", `${results.peakFlow.toFixed(0)} L/min`, results.peakFlow < 350],
    ["Residual volume", `${results.residualVolume.toFixed(1)} L`, results.residualVolume > 2],
    ["SpO₂", `${results.oxygenSaturation.toFixed(0)}%`, results.oxygenSaturation < 92],
    ["PaCO₂", `${results.carbonDioxide.toFixed(0)} mmHg`, results.carbonDioxide > 45],
  ] as const;

  return (
    <aside className="bg-background p-5 text-foreground">
      <p className="text-[11px] font-semibold tracking-[.1em] text-primary">PULMONARY FUNCTION</p>
      <dl className="mt-4 grid grid-cols-2 gap-x-4 border-y border-border">
        {values.map(([term, value, abnormal]) => (
          <div key={term} className="border-b border-border py-3">
            <div className="flex justify-between gap-2"><dt className="text-xs text-muted">{term}</dt><span className={`text-[9px] font-semibold ${abnormal ? "text-secondary" : "text-primary"}`}>{abnormal ? "ABNORMAL" : "IN RANGE"}</span></div>
            <dd className="mt-1 font-accent text-lg font-bold tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-5 text-[11px] font-semibold tracking-[.1em] text-primary">MECHANISM</p>
      <div className="mt-3 grid gap-2">
        <div className="rounded-md border border-border bg-white p-3"><p className="text-xs font-semibold">Dynamic airway compression</p><p className="mt-1 text-xs leading-5 text-muted">{model.elasticRecoilLoss > 45 ? "Reduced radial traction allows small airways to collapse during expiration." : "Elastic recoil is supporting expiratory flow."}</p></div>
        <div className="rounded-md border border-border bg-white p-3"><p className="text-xs font-semibold">Air trapping</p><p className="mt-1 text-xs leading-5 text-muted">{results.residualVolume > 2 ? "Incomplete emptying raises residual volume and hyperinflates the lungs." : "End-expiratory volume remains near reference."}</p></div>
        <div className="rounded-md border border-border bg-white p-3"><p className="text-xs font-semibold">Gas exchange</p><p className="mt-1 text-xs leading-5 text-muted">{model.gasExchangeLoss > 45 ? "V/Q mismatch and lost exchange area reduce oxygen transfer." : "Oxygen transfer is maintained."}</p></div>
      </div>
    </aside>
  );
}
