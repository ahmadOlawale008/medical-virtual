import HeartAnatomy from "./heart-anatomy";
import PulmonaryCongestion from "./pulmonary-congestion";
import VentricularMechanics from "./ventricular-mechanics";
import type { HeartFailureModel, HemodynamicResults } from "./model";
import { clamp } from "./model";

type Props = {
  model: HeartFailureModel;
  results: HemodynamicResults;
  stage: string;
  status: string;
};

export default function CirculationVisual({ model, results, stage, status }: Props) {
  const sympathetic = clamp(
    (82 - model.contractility) * 1.1 + (model.heartRate - 70) * 1.25,
    0,
    100,
  );
  const raas = clamp(
    (model.volume - 75) * 1.5 + Math.max(0, 4.8 - results.cardiacOutput) * 19,
    0,
    100,
  );
  const vasoconstriction = clamp((model.resistance - 1100) / 7, 0, 100);

  return (
    <div className="relative flex min-h-[700px] flex-col overflow-hidden border-b border-white/15 xl:border-b-0 xl:border-r">
      <div className="medical-grid absolute inset-0 opacity-20" />

      <div className="relative z-20 flex items-start justify-between gap-4 p-5">
        <div>
          <p className="text-[11px] text-white/40">CURRENT HEMODYNAMIC STATE</p>
          <h2 className="mt-1 text-xl font-semibold">{status}</h2>
          <p className="mt-1 text-xs text-white/45">
            Forward flow, chamber mechanics, and pulmonary back-pressure
          </p>
        </div>
        <span
          className="rounded-md border border-white/15 px-3 py-2 font-accent text-xs text-[#8fd0c4]"
          aria-live="polite"
        >
          {stage}
        </span>
      </div>

      <div className="relative z-10 grid flex-1 gap-3 px-4 pb-4 lg:grid-cols-[minmax(360px,1.2fr)_minmax(280px,.8fr)]">
        <HeartAnatomy model={model} results={results} />

        <div className="grid content-start gap-3">
          <VentricularMechanics model={model} results={results} />
          <PulmonaryCongestion results={results} />

          <section className="rounded-lg border border-[#d8bdb3] bg-[#fffaf8] p-3 text-[#4c2e29]">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[10px] font-semibold tracking-[.08em] text-[#75544c]">
                  COMPENSATORY DRIVE
                </p>
                <p className="mt-1 text-[9px] text-[#8d7770]">
                  Output support versus long-term ventricular load
                </p>
              </div>
              <span className="rounded-full border border-[#d8bdb3] bg-white px-2 py-1 text-[8px] font-semibold text-[#75544c]">
                LIVE
              </span>
            </div>

            <div className="mt-3 grid gap-2">
              <ResponseBar label="Sympathetic" value={sympathetic} detail={`${model.heartRate} bpm`} />
              <ResponseBar label="RAAS / retention" value={raas} detail={`${model.volume}% volume`} />
              <ResponseBar label="Vasoconstriction" value={vasoconstriction} detail={`${model.resistance} SVR`} />
            </div>
          </section>
        </div>
      </div>

      <div className="relative z-10 flex flex-wrap justify-between gap-3 border-t border-white/10 px-5 py-3 text-[11px] text-white/45">
        <span>Animated particles follow venous, pulmonary, and systemic flow through the heart.</span>
        <span>
          Heart anatomy: ZooFari · CC BY-SA 3.0. Supporting illustrations: Servier Medical Art · CC BY 4.0.
        </span>
      </div>
    </div>
  );
}

function ResponseBar({
  label,
  value,
  detail,
}: {
  label: string;
  value: number;
  detail: string;
}) {
  return (
    <div className="grid grid-cols-[92px_1fr_auto] items-center gap-2 text-[9px]">
      <span className="font-semibold text-[#75544c]">{label}</span>
      <div className="h-1.5 overflow-hidden rounded-full bg-[#eadbd6]">
        <div
          className={`h-full rounded-full transition-[width] duration-300 ${value > 55 ? "bg-secondary" : "bg-primary"}`}
          style={{ width: `${Math.max(3, value)}%` }}
        />
      </div>
      <span className="font-accent text-[#806c66]">{detail}</span>
    </div>
  );
}
