"use client";

import Image from "next/image";
import { useState } from "react";

const remoteRoot = "https://humanbiomedia.org/simulations/nervous-system/resting-membrane-potential";
const localRoot = "/physiology/resting-membrane-potential";

const modules = [
  { id: 1, short: "Membranes", title: "RMPs and cell membranes", summary: "Measure voltage across an excitable-cell membrane and review its lipid and protein components.", image: "neuron-membrane-channels-1.png", activities: [
    { label: "Measure the RMP", url: `${remoteRoot}/rmp-measurement.html`, note: "Position the reference electrode outside and recording electrode inside the membrane." },
    { label: "Explore the membrane", url: `${remoteRoot}/basic-excitable-cell-membrane.html`, note: "Review the phospholipid bilayer, transport channels, and carrier proteins." },
    { label: "Na⁺/K⁺ pump", url: `${remoteRoot}/na-k-pump-activity.html`, note: "Follow ATP-driven movement of 3 Na⁺ out and 2 K⁺ into the cell." },
  ]},
  { id: 2, short: "Main factors", title: "Factors affecting the resting potential", summary: "Relate concentration gradients, electrical gradients, and selective permeability to ion movement.", image: "concentration-gradient.png", activities: [
    { label: "Concentration gradients", url: `${remoteRoot}/concentration-gradients-activity.html`, note: "Change ion concentrations and observe diffusion down chemical gradients." },
    { label: "Membrane permeability", url: `${remoteRoot}/membrane-permeability-slider/index.html`, note: "Adjust relative ion permeability and inspect its effect on membrane voltage." },
  ]},
  { id: 3, short: "Equilibrium", title: "Ion equilibrium potentials", summary: "Watch chemical and electrical forces balance until net ion movement stops.", image: "electrochemical-gradient-1.png", activities: [
    { label: "Neutral membrane", url: `${remoteRoot}/equilibrium-potential-neutral.html`, note: "Begin with no charge separation across the membrane." },
    { label: "Developing potential", url: `${remoteRoot}/equilibrium-potential-developing.html`, note: "Observe diffusion generate an opposing electrical gradient." },
    { label: "Equilibrium reached", url: `${remoteRoot}/equilibrium-potential-developed.html`, note: "Identify the point where chemical and electrical forces balance." },
  ]},
  { id: 4, short: "Determine RMP", title: "Determining the RMP value", summary: "Combine individual ion equilibrium potentials according to relative membrane permeability.", image: "rmp-tug-of-war-2.gif", activities: [
    { label: "RMP determination", url: `${remoteRoot}/rmp-determination.html`, note: "Compare the competing influence of K⁺, Na⁺, and Cl⁻ on the final resting voltage." },
  ]},
  { id: 5, short: "Calculators", title: "Equations and calculators", summary: "Use Nernst and Goldman–Hodgkin–Katz equations to calculate membrane potentials.", image: "calculator-2.png", activities: [
    { label: "Nernst: potassium", url: `${remoteRoot}/nernst-potassium-calculator.html`, note: "Calculate Eₖ from intracellular and extracellular potassium concentrations." },
    { label: "Nernst: sodium", url: `${remoteRoot}/nernst-sodium-calculator.html`, note: "Calculate Eₙₐ from sodium concentrations." },
    { label: "Nernst: chloride", url: `${remoteRoot}/nernst-chloride-calculator.html`, note: "Calculate E꜀ₗ while accounting for its negative ionic charge." },
    { label: "Goldman–Hodgkin–Katz", url: "https://www.humanbiomedia.org/activities/nervous-system/ghk-calculator/ghk-equation-calculator.html", note: "Combine ion concentrations and relative permeabilities to estimate membrane potential." },
  ]},
  { id: 6, short: "Case studies", title: "Clinical case studies", summary: "Apply RMP principles to electrolyte disturbances and changes in neuromuscular excitability.", image: "case-studies-icon.png", activities: [] },
] as const;

export default function RestingMembranePotentialSimulator() {
  const [moduleIndex, setModuleIndex] = useState(0);
  const [activityIndex, setActivityIndex] = useState(0);
  const activeModule = modules[moduleIndex];
  const activity = activeModule.activities[activityIndex];
  function selectModule(index: number) { setModuleIndex(index); setActivityIndex(0); }
  return <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#092521] shadow-2xl shadow-black/20">
    <div className="flex gap-2 overflow-x-auto border-b border-white/10 p-4">{modules.map((item,index) => <button key={item.id} type="button" onClick={() => selectModule(index)} className={`min-w-[150px] rounded-xl border px-3 py-3 text-left transition ${moduleIndex === index ? "border-[#48d2b2] bg-[#48d2b2] text-[#092c29]" : "border-white/8 bg-white/[.025] text-white/55 hover:bg-white/6"}`}><span className={`text-[9px] font-bold tracking-[.14em] ${moduleIndex === index ? "text-[#0d5149]" : "text-[#79c8bc]"}`}>SECTION {item.id}</span><span className="mt-1 block text-xs font-semibold">{item.short}</span></button>)}</div>
    <div className="grid xl:grid-cols-[300px_minmax(0,1fr)]">
      <aside className="border-b border-white/10 p-5 xl:border-r xl:border-b-0"><div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#e7f0ee]"><Image src={`${localRoot}/${activeModule.image}`} alt="" fill sizes="300px" className="object-contain p-3" unoptimized /></div><p className="mt-5 text-[10px] font-semibold tracking-[.16em] text-[#79c8bc]">SECTION {activeModule.id} OF 6</p><h2 className="mt-2 text-xl font-semibold leading-7">{activeModule.title}</h2><p className="mt-3 text-xs leading-6 text-white/48">{activeModule.summary}</p>{activeModule.activities.length > 0 && <div className="mt-5 space-y-2">{activeModule.activities.map((item,index) => <button key={item.label} type="button" onClick={() => setActivityIndex(index)} className={`w-full rounded-xl border p-3 text-left text-xs font-semibold ${activityIndex === index ? "border-[#48d2b2]/60 bg-[#48d2b2]/10 text-[#a9e8da]" : "border-white/8 text-white/50 hover:bg-white/5"}`}>{item.label}</button>)}</div>}</aside>
      <div className="min-w-0 p-3 sm:p-5">{activity ? <><div className="mb-4"><p className="text-[10px] font-semibold tracking-[.14em] text-[#79c8bc]">{activity.label.toUpperCase()}</p><p className="mt-2 text-sm leading-6 text-white/55">{activity.note}</p></div><div className="overflow-hidden rounded-2xl border border-white/10 bg-white"><div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-600"><span className="text-xs font-semibold">Interactive activity</span><span className="text-[10px] uppercase tracking-[.14em] text-slate-400">{activity.label}</span></div><div className="overflow-auto"><iframe key={activity.url} src={activity.url} title={activity.label} className="block h-[720px] min-w-[800px] w-full border-0" allow="autoplay" /></div></div></> : <CaseStudies />}</div>
    </div>
  </section>;
}

function CaseStudies() {
  return <div><p className="text-[10px] font-semibold tracking-[.14em] text-[#79c8bc]">CLINICAL APPLICATION</p><h3 className="mt-2 text-2xl font-semibold">Electrolytes and excitability</h3><p className="mt-2 max-w-3xl text-sm leading-6 text-white/50">Predict how changes in extracellular ion concentration alter the resting potential and the ability of nerve and muscle membranes to produce action potentials.</p><div className="mt-6 grid gap-4 md:grid-cols-2"><Case image="female-runner.png" label="Endurance athlete" title="Hyponatremia" copy="Excess hypotonic fluid intake lowers extracellular sodium. Consider the concentration gradient, cellular water movement, and neurological consequences." /><Case image="male-runner.png" label="Endurance athlete" title="Potassium disturbance" copy="Changes in extracellular potassium move Eₖ and the RMP. Determine whether the membrane depolarizes or hyperpolarizes and how excitability changes." /></div><div className="mt-5 rounded-2xl border border-white/10 bg-white/[.035] p-5"><p className="text-sm font-semibold">Core reasoning check</p><ol className="mt-3 list-decimal space-y-2 pl-5 text-xs leading-5 text-white/50"><li>Identify which ion concentration changed.</li><li>Predict the new electrochemical driving force.</li><li>Determine the direction of the RMP shift.</li><li>Relate the shift to action-potential threshold and symptoms.</li></ol></div></div>;
}

function Case({ image, label, title, copy }: { image: string; label: string; title: string; copy: string }) {
  return <article className="overflow-hidden rounded-2xl bg-[#f5f1e8] text-slate-700"><div className="relative h-52 bg-[#e7f0ee]"><Image src={`${localRoot}/${image}`} alt="" fill sizes="(max-width: 768px) 100vw, 420px" className="object-contain" unoptimized /></div><div className="p-5"><p className="text-[10px] font-bold tracking-[.14em] text-emerald-700">{label}</p><h4 className="mt-2 text-lg font-semibold text-slate-900">{title}</h4><p className="mt-2 text-xs leading-6 text-slate-500">{copy}</p></div></article>;
}
