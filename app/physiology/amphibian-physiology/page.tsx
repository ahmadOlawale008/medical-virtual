import type { Metadata } from "next";
import ExperimentList from "../components/experiment-list";
import PhysiologyHeader from "../components/physiology-header";
import { amphibianExperiments } from "../lab-data";

export const metadata: Metadata = {
  title: "Amphibian Physiology | MedLab Virtual",
  description: "Browse virtual amphibian nerve, muscle, and cardiac physiology experiments.",
};

export default function AmphibianPhysiologyPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <PhysiologyHeader backToCategories />
      <main>
        <section className="border-y border-border bg-white">
          <div className="mx-auto max-w-6xl px-4 py-9">
            <p className="text-xs font-semibold tracking-[.1em] text-primary">PHYSIOLOGY · AMPHIBIAN PREPARATIONS</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Amphibian Physiology</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
              Select a nerve–muscle or cardiac preparation and investigate how the recorded response changes under controlled conditions.
            </p>
          </div>
        </section>
        <section className="mx-auto max-w-6xl px-4 py-10">
          <div className="mb-5 flex items-center justify-between border-b border-border pb-4">
            <h2 className="text-sm font-semibold">Experimental preparations</h2>
            <span className="text-xs text-muted">10 experiments</span>
          </div>
          <ExperimentList experiments={amphibianExperiments} />
        </section>
      </main>
    </div>
  );
}
