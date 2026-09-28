import type { Metadata } from "next";
import ExperimentList from "../components/experiment-list";
import PhysiologyHeader from "../components/physiology-header";
import { cardiovascularExperiments } from "../lab-data";

export const metadata: Metadata = { title: "Cardiovascular Physiology | MedLab Virtual", description: "Interactive human cardiovascular physiology simulations." };

export default function CardiovascularPage() {
  return <div className="min-h-dvh bg-background text-foreground"><PhysiologyHeader backToCategories /><main><section className="border-y border-border bg-white"><div className="mx-auto max-w-6xl px-4 py-9"><p className="text-xs font-semibold tracking-[.1em] text-primary">PHYSIOLOGY · CARDIOVASCULAR</p><h1 className="mt-3 text-3xl font-semibold tracking-tight">Cardiovascular Physiology</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-muted">Explore human cardiac mechanics, electrical activity, pressure, volume, blood flow, and heart sounds.</p></div></section><section className="mx-auto max-w-6xl px-4 py-10"><div className="mb-5 flex items-center justify-between border-b border-border pb-4"><h2 className="text-sm font-semibold">Cardiovascular simulations</h2><span className="text-xs text-muted">1 experiment</span></div><ExperimentList experiments={cardiovascularExperiments} /></section></main></div>;
}
