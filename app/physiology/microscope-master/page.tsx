import type { Metadata } from "next";
import PhysiologyHeader from "../components/physiology-header";

export const metadata: Metadata = {
  title: "Microscope Master | MedLab Virtual",
  description: "Interactive 3D microscope orientation, stage control, focusing, and magnification practice.",
};

const objectives = [
  ["4×", "Scanning", "Locate the specimen and center the field."],
  ["10×", "Low power", "Refine stage position and coarse focus."],
  ["40×", "High power", "Use fine focus and control illumination."],
  ["100×", "Oil immersion", "Apply immersion oil and use fine focus only."],
] as const;

export default function MicroscopeMasterPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <PhysiologyHeader backToCategories />
      <main>
        <section className="border-y border-border bg-white">
          <div className="mx-auto max-w-6xl px-4 py-9">
            <p className="text-xs font-semibold tracking-[.1em] text-primary">PHYSIOLOGY · INSTRUMENT TRAINING</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Microscope Master</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
              A single interactive workspace for 3D microscope orientation, stage movement, focusing, illumination, and objective selection.
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-4 px-4 py-10 lg:grid-cols-[1.1fr_.9fr]">
          <article className="rounded-lg border border-primary/30 bg-primary-soft p-6">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-primary">INTERACTIVE WORKSPACE</span>
              <span className="font-accent text-xs text-muted">01</span>
            </div>
            <h2 className="mt-5 text-xl font-semibold">3D microscope and synchronized specimen view</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
              Rotate the microscope, select a component, move the mechanical stage, and see every focus or objective change reflected in the eyepiece field.
            </p>
            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {["360° instrument rotation", "Clickable components", "X–Y stage controls", "Coarse and fine focus", "Condenser and diaphragm", "Objective-dependent field view"].map((feature) => (
                <div key={feature} className="rounded-md border border-border bg-white px-3 py-2.5 text-xs text-muted">
                  {feature}
                </div>
              ))}
            </div>
            <span className="mt-6 inline-flex min-h-9 items-center rounded-md border border-border bg-white px-3 text-xs font-semibold text-muted">
              3D workspace planned
            </span>
          </article>

          <aside className="rounded-lg border border-border bg-white p-6">
            <p className="text-xs font-semibold tracking-[.08em] text-primary">OBJECTIVE PROGRESSION</p>
            <div className="mt-4 divide-y divide-border border-y border-border">
              {objectives.map(([power, name, description]) => (
                <div key={power} className="grid grid-cols-[52px_1fr] gap-3 py-4">
                  <span className="font-accent text-lg font-bold text-foreground">{power}</span>
                  <div>
                    <h2 className="text-sm font-semibold">{name}</h2>
                    <p className="mt-1 text-xs leading-5 text-muted">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
