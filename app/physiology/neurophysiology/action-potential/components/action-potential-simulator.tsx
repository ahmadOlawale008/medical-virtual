"use client";

import Image from "next/image";
import { useState } from "react";

const activityRoot = "https://www.humanbiomedia.org/simulations/nervous-system/action-potential";
const imageRoot = "/physiology/action-potential";

const sections = [
  {
    number: "01", label: "Introduction", title: "Action potential overview",
    description: "Connect resting membrane conditions, threshold, ion movement, and the recording setup to the complete action-potential waveform.",
    image: "action-potential-diagram.png",
    activities: [{ label: "Action potential overview", url: `${activityRoot}/exercises/ap-overview-exercise.html`, note: "Identify the membrane events and channel behavior that produce an action potential." }],
  },
  {
    number: "02", label: "Phases", title: "Phases of the action potential",
    description: "Follow voltage-gated Na⁺ and K⁺ channels through depolarization, repolarization, and hyperpolarization.",
    image: "na-positive-feedback-cycle.png",
    activities: [{ label: "Explore the phases", url: `${activityRoot}/exercises/ap-phases-exercise.html`, note: "Relate each portion of the voltage trace to changing Na⁺ and K⁺ channel states." }],
  },
  {
    number: "03", label: "Summation", title: "Summation of graded potentials",
    description: "Compare temporal summation from repeated input with spatial summation from inputs arriving at several locations.",
    image: "temporal-summation-neurons.png",
    activities: [
      { label: "Temporal summation", url: `${activityRoot}/exercises/ap-temporal-summation-exercise.html`, note: "Change the interval between stimuli and determine whether their graded responses reach threshold." },
      { label: "Spatial summation", url: `${activityRoot}/exercises/ap-spatial-summation-exercise.html`, note: "Recruit inputs at different locations and observe their combined effect at the axon hillock." },
    ],
  },
  {
    number: "04", label: "All-or-None", title: "The all-or-none law",
    description: "Compare subthreshold, threshold, and suprathreshold stimuli and verify that action-potential amplitude does not scale above threshold.",
    image: "action-potential-neuron-setup.png",
    activities: [{ label: "Test stimulus strength", url: `${activityRoot}/exercises/ap-all-or-none-exercise.html`, note: "Increase stimulus strength and identify the first response that reaches threshold." }],
  },
  {
    number: "05", label: "Refractory", title: "Absolute and relative refractory periods",
    description: "Deliver a second stimulus at different delays to determine when another action potential is impossible and when it needs a stronger stimulus.",
    image: "na-channel-blocking.png",
    activities: [{ label: "Refractory periods", url: `${activityRoot}/exercises/ap-refractory-periods-exercise.html`, note: "Move the second stimulus through the absolute and relative refractory periods." }],
  },
] as const;

export default function ActionPotentialSimulator() {
  const [sectionIndex, setSectionIndex] = useState(0);
  const [activityIndex, setActivityIndex] = useState(0);
  const section = sections[sectionIndex];
  const activity = section.activities[activityIndex];

  function chooseSection(index: number) {
    setSectionIndex(index);
    setActivityIndex(0);
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#092521] shadow-2xl shadow-black/20">
      <div className="flex gap-2 overflow-x-auto border-b border-white/10 p-4">
        {sections.map((item, index) => (
          <button key={item.number} type="button" onClick={() => chooseSection(index)} className={`min-w-[155px] rounded-xl border px-3 py-3 text-left transition ${sectionIndex === index ? "border-[#48d2b2] bg-[#48d2b2] text-[#092c29]" : "border-white/8 bg-white/[.025] text-white/55 hover:bg-white/6"}`}>
            <span className={`text-[9px] font-bold tracking-[.14em] ${sectionIndex === index ? "text-[#0d5149]" : "text-[#79c8bc]"}`}>SECTION {item.number}</span>
            <span className="mt-1 block text-xs font-semibold">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="grid xl:grid-cols-[310px_minmax(0,1fr)]">
        <aside className="border-b border-white/10 p-5 xl:border-r xl:border-b-0">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#e7f0ee]">
            <Image src={`${imageRoot}/${section.image}`} alt={`${section.title} diagram`} fill sizes="310px" className="object-contain p-3" unoptimized />
          </div>
          <p className="mt-5 text-[10px] font-semibold tracking-[.16em] text-[#79c8bc]">SECTION {section.number} OF 05</p>
          <h2 className="mt-2 text-xl font-semibold leading-7">{section.title}</h2>
          <p className="mt-3 text-xs leading-6 text-white/48">{section.description}</p>
          <div className="mt-5 space-y-2">
            {section.activities.map((item, index) => (
              <button key={item.label} type="button" onClick={() => setActivityIndex(index)} className={`w-full rounded-xl border p-3 text-left text-xs font-semibold ${activityIndex === index ? "border-[#48d2b2]/60 bg-[#48d2b2]/10 text-[#a9e8da]" : "border-white/8 text-white/50 hover:bg-white/5"}`}>{item.label}</button>
            ))}
          </div>
        </aside>

        <div className="min-w-0 p-3 sm:p-5">
          <div className="mb-4">
            <p className="text-[10px] font-semibold tracking-[.14em] text-[#79c8bc]">{activity.label.toUpperCase()}</p>
            <p className="mt-2 text-sm leading-6 text-white/55">{activity.note}</p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-600">
              <span className="text-xs font-semibold">Interactive activity</span>
              <span className="text-[10px] uppercase tracking-[.14em] text-slate-400">{section.label}</span>
            </div>
            <div className="overflow-auto">
              <iframe key={activity.url} src={activity.url} title={activity.label} className="block h-[720px] min-w-[800px] w-full border-0" allow="autoplay" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
