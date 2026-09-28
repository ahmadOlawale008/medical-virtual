"use client";

import { useState } from "react";

type Section = "procedure" | "background" | "results" | "cases";

const activityRoot = "https://humanbiomedia.org/simulations/circulatory-system/hematocrit";

const steps = [
  { title: "Lance finger", instruction: "Clean and lance the fingertip to obtain a blood drop.", file: "lance-finger.html" },
  { title: "Collect blood", instruction: "Touch the capillary tube to the drop and allow it to fill by capillary action.", file: "collect-blood.html" },
  { title: "Seal tube", instruction: "Plug the dry end of the capillary tube with sealing clay.", file: "seal-tube.html" },
  { title: "Load centrifuge", instruction: "Place the tube in the rotor with its sealed end facing outward.", file: "place-tubes.html" },
  { title: "Set centrifuge", instruction: "Close the lid and adjust the centrifuge settings.", file: "centrifuge-settings.html" },
  { title: "Centrifuge", instruction: "Run the rotor to separate the blood into its component layers.", file: "centrifuge-rotor.html" },
  { title: "Examine layers", instruction: "Identify packed red cells, the buffy coat, and plasma.", file: "component-layers.html" },
  { title: "Use reader card", instruction: "Align the blood-column boundaries with the hematocrit reader.", file: "tube-reader-card.html" },
  { title: "Determine HCT", instruction: "Move the tube and read the packed-cell percentage.", file: "determine-value-drag.html" },
] as const;

const cases = [
  { value: 22, title: "Severe anemia", detail: "Young woman reporting marked fatigue." },
  { value: 28, title: "Moderate anemia", detail: "Older adult with iron deficiency." },
  { value: 35, title: "Mild anemia", detail: "Patient in the third trimester of pregnancy." },
  { value: 42, title: "Normal hematocrit", detail: "Healthy adult reference sample." },
  { value: 45, title: "Normal hematocrit", detail: "Active young adult male." },
  { value: 50, title: "High-normal hematocrit", detail: "Athletic adult male." },
  { value: 58, title: "Polycythemia", detail: "Mountain climber acclimatized to high altitude." },
  { value: 65, title: "Severe polycythemia", detail: "Patient with chronic lung disease." },
] as const;

function ActivityFrame({ file, title }: { file: string; title: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl shadow-black/20">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-700">
        <span className="text-xs font-semibold">Interactive activity</span>
        <span className="text-[10px] uppercase tracking-[.16em] text-slate-400">{title}</span>
      </div>
      <div className="overflow-auto bg-white">
        <iframe
          key={file}
          src={`${activityRoot}/${file}`}
          title={title}
          className="block h-[720px] min-w-[800px] w-full border-0"
          allow="autoplay"
        />
      </div>
    </div>
  );
}

function TabButton({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-xs font-semibold transition ${active ? "bg-[#48d2b2] text-[#092c29]" : "bg-white/7 text-white/60 hover:bg-white/12 hover:text-white"}`}
    >
      {children}
    </button>
  );
}

export default function HematocritSimulator() {
  const [section, setSection] = useState<Section>("procedure");
  const [step, setStep] = useState(0);
  const [caseIndex, setCaseIndex] = useState(3);

  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#092521] shadow-2xl shadow-black/20">
      <div className="flex flex-wrap gap-2 border-b border-white/10 px-4 py-4 sm:px-6">
        <TabButton active={section === "procedure"} onClick={() => setSection("procedure")}>Procedure</TabButton>
        <TabButton active={section === "background"} onClick={() => setSection("background")}>Background</TabButton>
        <TabButton active={section === "results"} onClick={() => setSection("results")}>Results</TabButton>
        <TabButton active={section === "cases"} onClick={() => setSection("cases")}>Case studies</TabButton>
      </div>

      {section === "procedure" && (
        <div className="grid xl:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="border-b border-white/10 p-4 xl:border-r xl:border-b-0 xl:p-5">
            <p className="text-[10px] font-semibold tracking-[.16em] text-[#79c8bc]">MICROHEMATOCRIT PROCEDURE</p>
            <div className="mt-4 grid gap-1.5 sm:grid-cols-3 xl:grid-cols-1">
              {steps.map((item, index) => (
                <button
                  key={item.file}
                  type="button"
                  onClick={() => setStep(index)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${step === index ? "bg-[#48d2b2] text-[#092c29]" : "text-white/58 hover:bg-white/7 hover:text-white"}`}
                >
                  <span className={`grid size-6 shrink-0 place-items-center rounded-full text-[10px] font-bold ${step === index ? "bg-[#092c29]/15" : "bg-white/8"}`}>{index + 1}</span>
                  <span className="text-xs font-medium">{item.title}</span>
                </button>
              ))}
            </div>
          </aside>

          <div className="min-w-0 p-3 sm:p-5">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold tracking-[.14em] text-[#79c8bc]">STEP {step + 1} OF {steps.length}</p>
                <h2 className="mt-1 text-lg font-semibold">{steps[step].title}</h2>
                <p className="mt-1 text-sm text-white/55">{steps[step].instruction}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button type="button" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-white/65 disabled:opacity-25">Back</button>
                <button type="button" disabled={step === steps.length - 1} onClick={() => setStep((value) => Math.min(steps.length - 1, value + 1))} className="rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-white disabled:opacity-25">Next</button>
              </div>
            </div>
            <ActivityFrame file={steps[step].file} title={steps[step].title} />
          </div>
        </div>
      )}

      {section === "background" && (
        <div className="grid gap-5 p-5 lg:grid-cols-[1.15fr_.85fr] lg:p-7">
          <article className="rounded-2xl bg-[#f5f1e8] p-6 text-slate-800 sm:p-8">
            <p className="text-[10px] font-bold tracking-[.16em] text-emerald-700">WHAT HEMATOCRIT MEASURES</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">Packed cell volume</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">Hematocrit is the percentage of whole blood occupied by red blood cells. Centrifugation separates the sample into packed erythrocytes at the bottom, a thin buffy coat of leukocytes and platelets, and plasma above.</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {[['Adult male','41–50%'],['Adult female','36–44%'],['Children','32–44%']].map(([label,value]) => (
                <div key={label} className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 text-xl font-semibold text-emerald-700">{value}</p></div>
              ))}
            </div>
          </article>
          <aside className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-[10px] font-semibold tracking-[.16em] text-[#79c8bc]">SUBJECT</p>
            <h3 className="mt-3 text-xl font-semibold">27-year-old male</h3>
            <p className="mt-4 text-sm leading-7 text-white/58">The subject recently moved from Missouri to Denver. He is healthy and exercises regularly, but has experienced light-headedness and fatigue since moving to higher altitude.</p>
            <div className="mt-6 rounded-xl border border-[#48d2b2]/20 bg-[#48d2b2]/8 p-4 text-sm leading-6 text-[#a9e8da]">Your task is to prepare his capillary sample and determine whether his hematocrit is within the adult male reference range.</div>
          </aside>
        </div>
      )}

      {section === "results" && (
        <div className="grid gap-5 p-5 xl:grid-cols-[minmax(0,1fr)_300px] xl:p-7">
          <ActivityFrame file="determine-value-drag.html" title="Determine hematocrit" />
          <aside className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-[10px] font-semibold tracking-[.16em] text-[#79c8bc]">SUBJECT RESULT</p>
              <p className="mt-3 text-4xl font-semibold text-[#48d2b2]">≈46%</p>
              <p className="mt-2 text-sm text-white/55">Within the normal adult male range of 41–50%.</p>
            </div>
            <div className="rounded-2xl border border-white/10 p-5">
              <h3 className="text-sm font-semibold">Interpretation</h3>
              <p className="mt-2 text-xs leading-6 text-white/50">The sample does not indicate anemia or polycythemia. Symptoms after relocation may relate to acclimatization, but this educational result is not a clinical diagnosis.</p>
            </div>
          </aside>
        </div>
      )}

      {section === "cases" && (
        <div className="grid xl:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="border-b border-white/10 p-5 xl:border-r xl:border-b-0">
            <p className="text-[10px] font-semibold tracking-[.16em] text-[#79c8bc]">CASE STUDIES</p>
            <p className="mt-2 text-xs leading-5 text-white/45">Select a sample, measure its packed-cell fraction, then compare it with the clinical context.</p>
            <div className="mt-4 grid grid-cols-2 gap-2 xl:grid-cols-1">
              {cases.map((item, index) => (
                <button key={item.value} type="button" onClick={() => setCaseIndex(index)} className={`rounded-xl border p-3 text-left transition ${caseIndex === index ? "border-[#48d2b2]/60 bg-[#48d2b2]/10" : "border-white/8 hover:bg-white/5"}`}>
                  <span className="text-sm font-semibold text-white">{item.value}% · {item.title}</span>
                  <span className="mt-1 block text-[11px] leading-4 text-white/42">{item.detail}</span>
                </button>
              ))}
            </div>
          </aside>
          <div className="min-w-0 p-3 sm:p-5">
            <div className="mb-4"><h2 className="text-lg font-semibold">Case {caseIndex + 1}: {cases[caseIndex].title}</h2><p className="mt-1 text-sm text-white/50">{cases[caseIndex].detail} Measure the tube before using the displayed value to check your reading.</p></div>
            <ActivityFrame file={`hct-value-${cases[caseIndex].value}-percent.html`} title={`${cases[caseIndex].value}% hematocrit case`} />
          </div>
        </div>
      )}
    </section>
  );
}
