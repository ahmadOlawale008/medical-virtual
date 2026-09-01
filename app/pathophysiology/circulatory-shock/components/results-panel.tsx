import type { ShockModel, ShockResults } from "./model";
import { getDominantShock } from "./model";

export default function ResultsPanel({
  model,
  results,
}: {
  model: ShockModel;
  results: ShockResults;
}) {
  const values = [
    ["MAP", `${results.map.toFixed(0)} mmHg`, results.map < 65],
    ["Cardiac output", `${results.cardiacOutput.toFixed(1)} L/min`, results.cardiacOutput < 4],
    ["Stroke volume", `${results.strokeVolume.toFixed(0)} mL`, results.strokeVolume < 50],
    ["Heart rate", `${results.heartRate.toFixed(0)} bpm`, results.heartRate > 100],
    ["SVR", `${results.svr.toFixed(0)} dyn·s/cm⁵`, results.svr < 700 || results.svr > 1400],
    ["CVP", `${results.cvp.toFixed(0)} mmHg`, results.cvp < 3 || results.cvp > 10],
    ["Lactate", `${results.lactate.toFixed(1)} mmol/L`, results.lactate >= 2],
    ["Urine output", `${results.urineOutput.toFixed(2)} mL/kg/h`, results.urineOutput < 0.5],
  ] as const;

  const dominant = getDominantShock(model);

  return (
    <aside className="bg-background p-5 text-foreground">
      <p className="text-[11px] font-semibold tracking-[.1em] text-primary">
        HEMODYNAMICS
      </p>
      <dl className="mt-4 grid grid-cols-2 gap-x-4 border-y border-border">
        {values.map(([term, value, abnormal]) => (
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
        SHOCK PROFILE
      </p>
      <div className="mt-3 rounded-md border border-border bg-white p-4">
        <p className="text-sm font-semibold">{dominant}</p>
        <p className="mt-2 text-xs leading-5 text-muted">
          {dominant === "Hypovolemic" && "Reduced circulating volume lowers preload and stroke volume."}
          {dominant === "Cardiogenic" && "Pump failure lowers forward flow despite elevated filling pressure."}
          {dominant === "Distributive" && "Loss of vascular tone reduces SVR and effective organ perfusion."}
          {dominant === "Obstructive" && "Mechanical impedance limits filling or ventricular outflow."}
        </p>
      </div>
    </aside>
  );
}
