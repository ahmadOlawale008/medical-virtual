import type { Metadata } from "next";
import ExperimentList from "../../components/experiment-list";
import PhysiologyHeader from "../../components/physiology-header";
import { hemoglobinSaturationParts } from "../../lab-data";

export const metadata: Metadata = {
  title: "Hemoglobin Oxygen Saturation | MedLab Virtual",
  description:
    "Choose a part of the Human Bio Media hemoglobin oxygen saturation simulation: oxygen transport, the dissociation curve, pulse oximetry, or the altitude case study.",
};

export default function OxygenSaturationHubPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <PhysiologyHeader backHref="/physiology/hematology" backLabel="Hematology Lab" />
      <main>
        <section className="border-y border-border bg-white">
          <div className="mx-auto max-w-6xl px-4 py-9">
            <p className="text-xs font-semibold tracking-[.1em] text-primary">PHYSIOLOGY · HEMATOLOGY</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Hemoglobin Oxygen Saturation</h1>
            <p className="mt-1 text-base font-medium text-muted">The Effects of Altitude</p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
              Explore oxygen transport from the alveoli to the tissues, the oxyhemoglobin dissociation
              curve, pulse oximetry, and a case study on how altitude alters hemoglobin oxygen
              saturation. Each part pairs its own simulations with a dedicated assessment.
            </p>
          </div>
        </section>
        <section className="mx-auto max-w-6xl px-4 py-10">
          <div className="mb-5 flex items-center justify-between border-b border-border pb-4">
            <h2 className="text-sm font-semibold">Simulation parts</h2>
            <span className="text-xs text-muted">4 parts</span>
          </div>
          <ExperimentList experiments={hemoglobinSaturationParts} cardLabel="PART" actionLabel="Open part" />
        </section>
      </main>
    </div>
  );
}

