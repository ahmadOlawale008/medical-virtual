import type { Metadata } from "next";
import ExperimentList from "../components/experiment-list";
import PhysiologyHeader from "../components/physiology-header";
import { renalPhysiologyExperiments } from "../lab-data";

export const metadata: Metadata = { title: "Renal Physiology Lab | MedLab Virtual", description: "Perform urinalysis and interpret renal laboratory findings." };

export default function RenalPhysiologyPage() {
  return <div className="min-h-dvh bg-background text-foreground"><PhysiologyHeader backToCategories /><main><section className="border-y border-border bg-white"><div className="mx-auto max-w-6xl px-4 py-9"><p className="text-xs font-semibold tracking-[.1em] text-primary">PHYSIOLOGY · RENAL PHYSIOLOGY</p><h1 className="mt-3 text-3xl font-semibold tracking-tight">Renal Physiology Lab</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-muted">Examine urine and connect physical, chemical, and microscopic findings with renal function and systemic disease.</p></div></section><section className="mx-auto max-w-6xl px-4 py-10"><div className="mb-5 flex items-center justify-between border-b border-border pb-4"><h2 className="text-sm font-semibold">Renal physiology simulations</h2><span className="text-xs text-muted">1 experiment</span></div><ExperimentList experiments={renalPhysiologyExperiments} /></section></main></div>;
}
