"use client";

import Image from "next/image";
import { useState } from "react";

const localRoot = "/physiology/urinalysis";
const remoteRoot = "https://humanbiomedia.org/simulations/urinary-system/urinalysis/chemical-exam";

const analytes = [
  ["Leukocytes", "Leukocyte esterase; elevation may indicate a urinary tract infection."],
  ["Nitrites", "A positive result may indicate nitrate-reducing bacteria in a UTI."],
  ["Urobilinogen", "Elevation may accompany liver dysfunction or increased bilirubin breakdown."],
  ["Protein", "Proteinuria may indicate glomerular or other renal disease."],
  ["pH", "Measures acidity or alkalinity; the usual range is approximately 4.6–8.0."],
  ["Blood", "Detects haemoglobin and may indicate urinary tract bleeding or renal injury."],
  ["Specific gravity", "Estimates urine concentration and therefore hydration and concentrating ability."],
  ["Ketones", "May rise when fat becomes the main energy source, including uncontrolled diabetes."],
  ["Bilirubin", "An abnormal result may indicate liver disease or biliary obstruction."],
  ["Glucose", "Glucosuria commonly appears when blood glucose exceeds the renal threshold."],
] as const;

const stages = [
  { label: "Patient", title: "Meet the test subject", image: "test-subject.png" },
  { label: "Test strip", title: "Understand the reagent pads", image: "urine-test-strip-2.png" },
  { label: "Immerse", title: "Perform the chemical examination", image: "cover-image.png" },
  { label: "Read results", title: "Compare with the colour chart", image: "urine-color-chart-reading-1.png" },
  { label: "Reference", title: "Chemical tests and indications", image: "test-strip-chart-6.png" },
] as const;

export default function UrineTestStripSimulator() {
  const [stage, setStage] = useState(0);
  const current = stages[stage];
  return <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#092521] shadow-2xl shadow-black/20">
    <nav aria-label="Urinalysis workflow" className="flex gap-2 overflow-x-auto border-b border-white/10 p-4">{stages.map((item, index) => <button key={item.label} type="button" onClick={() => setStage(index)} aria-current={stage === index ? "step" : undefined} className={`min-w-[150px] rounded-xl border px-3 py-3 text-left transition ${stage === index ? "border-[#48d2b2] bg-[#48d2b2] text-[#092c29]" : "border-white/8 bg-white/[.025] text-white/55 hover:bg-white/6"}`}><span className={`text-[9px] font-bold tracking-[.14em] ${stage === index ? "text-[#0d5149]" : "text-[#79c8bc]"}`}>STEP {String(index + 1).padStart(2, "0")}</span><span className="mt-1 block text-xs font-semibold">{item.label}</span></button>)}</nav>
    <div className="grid xl:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="border-b border-white/10 p-5 xl:border-r xl:border-b-0"><div className="relative aspect-square overflow-hidden rounded-2xl bg-[#edf4f2]"><Image src={`${localRoot}/${current.image}`} alt={`${current.title} illustration`} fill sizes="320px" className="object-contain p-3" unoptimized /></div><p className="mt-5 text-[10px] font-semibold tracking-[.16em] text-[#79c8bc]">CHEMICAL EXAM · STEP {stage + 1} OF 5</p><h2 className="mt-2 text-xl font-semibold leading-7">{current.title}</h2><StageSummary stage={stage} /></aside>
      <div className="min-w-0 p-3 sm:p-5"><StageContent stage={stage} /></div>
    </div>
  </section>;
}

function StageSummary({ stage }: { stage: number }) {
  const copy = [
    "Review the history before testing so the laboratory findings can be interpreted in clinical context.",
    "Each absorbent pad contains reagents that change colour in response to a particular urine constituent.",
    "Submerge every reagent pad, remove excess urine, and wait for the reactions to develop.",
    "Read pads in their specified time order and report quantitative or semi-quantitative values.",
    "Use the reference list to connect abnormal findings with likely physiological or pathological causes.",
  ];
  return <p className="mt-3 text-xs leading-6 text-white/48">{copy[stage]}</p>;
}

function StageContent({ stage }: { stage: number }) {
  if (stage === 0) return <div className="rounded-2xl border border-white/10 bg-white/[.035] p-6"><p className="text-[10px] font-semibold tracking-[.14em] text-[#79c8bc]">PATIENT HISTORY</p><h3 className="mt-2 text-2xl font-semibold">40-year-old home-based consultant</h3><p className="mt-4 max-w-3xl text-sm leading-7 text-white/55">Her increasingly sedentary workload interrupted her exercise routine, and she gained 50 pounds over two years. She reports frequent urination, persistent hunger and thirst, and fatigue. Her previous physical examination several years ago was normal.</p><div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{["Polyuria", "Polydipsia", "Polyphagia", "Fatigue"].map(item => <div key={item} className="rounded-xl border border-white/8 bg-black/10 p-4 text-sm font-semibold text-[#a9e8da]">{item}</div>)}</div></div>;
  if (stage === 1) return <div><p className="text-[10px] font-semibold tracking-[.14em] text-[#79c8bc]">BACKGROUND</p><h3 className="mt-2 text-2xl font-semibold">Ten tests on one strip</h3><p className="mt-3 max-w-3xl text-sm leading-7 text-white/50">The plastic strip carries absorbent reagent pads. After immersion, each pad changes colour according to the amount of its target chemical in the urine.</p><div className="mt-6 grid gap-3 sm:grid-cols-2">{analytes.map(([name, description]) => <article key={name} className="rounded-xl border border-white/8 bg-white/[.03] p-4"><h4 className="text-sm font-semibold text-[#a9e8da]">{name}</h4><p className="mt-2 text-xs leading-5 text-white/45">{description}</p></article>)}</div></div>;
  if (stage === 2) return <Activity title="Immerse the urine test strip" note="Cover every reagent pad, remove the strip horizontally to prevent reagent run-over, then allow two minutes for all reactions to finish." url={`${remoteRoot}/urine-test-strip-immersion.html`} />;
  if (stage === 3) return <Activity title="Read the reacted test strip" note="Compare each pad with the matching row on the manufacturer’s colour chart, following the indicated read times." url={`${remoteRoot}/urine-chemical-exam-results.html`} />;
  return <div><p className="text-[10px] font-semibold tracking-[.14em] text-[#79c8bc]">RESULT INTERPRETATION</p><h3 className="mt-2 text-2xl font-semibold">Diagnostic reference</h3><div className="relative mt-5 min-h-[720px] overflow-hidden rounded-2xl bg-[#edf4f2]"><Image src={`${localRoot}/test-strip-chart-6.png`} alt="Urine test-strip diagnostic colour chart" fill sizes="900px" className="object-contain p-4" unoptimized /></div></div>;
}

function Activity({ title, note, url }: { title: string; note: string; url: string }) {
  return <><div className="mb-4"><p className="text-[10px] font-semibold tracking-[.14em] text-[#79c8bc]">INTERACTIVE ACTIVITY</p><h3 className="mt-2 text-xl font-semibold">{title}</h3><p className="mt-2 max-w-3xl text-sm leading-6 text-white/55">{note}</p></div><div className="overflow-hidden rounded-2xl border border-white/10 bg-white"><div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-600"><span className="text-xs font-semibold">Urinalysis workspace</span><span className="text-[10px] uppercase tracking-[.14em] text-slate-400">Chemical exam</span></div><div className="overflow-auto"><iframe src={url} title={title} className="block h-[800px] min-w-[800px] w-full border-0" allow="autoplay" /></div></div></>;
}
