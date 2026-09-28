import type { Metadata } from "next";
import ExperimentList from "../components/experiment-list";
import PhysiologyHeader from "../components/physiology-header";
import { hematologyExperiments } from "../lab-data";

export const metadata: Metadata = {
  title: "Hematology Lab | MedLab Virtual",
  description: "Choose a virtual blood counting or hematocrit laboratory simulation.",
};

export default function HematologyPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <PhysiologyHeader backToCategories />
      <main>
        <section className="border-y border-border bg-white">
          <div className="mx-auto max-w-6xl px-4 py-9">
            <p className="text-xs font-semibold tracking-[.1em] text-primary">PHYSIOLOGY · HEMATOLOGY</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Hematology Lab</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
              Select a blood-cell counting or packed-cell-volume procedure. Each simulation combines laboratory technique with live calculations.
            </p>
          </div>
        </section>
        <section className="mx-auto max-w-6xl px-4 py-10">
          <div className="mb-5 flex items-center justify-between border-b border-border pb-4">
            <h2 className="text-sm font-semibold">Hematology simulations</h2>
            <span className="text-xs text-muted">7 experiments</span>
          </div>
          <ExperimentList experiments={hematologyExperiments} />
        </section>
      </main>
    </div>
  );
}
