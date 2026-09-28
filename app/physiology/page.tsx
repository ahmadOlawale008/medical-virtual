import type { Metadata } from "next";
import Link from "next/link";
import PhysiologyHeader from "./components/physiology-header";

export const metadata: Metadata = {
  title: "Physiology Laboratories | MedLab Virtual",
  description: "Choose from hematology, amphibian physiology, and microscope laboratories.",
};

const categories = [
  {
    number: "01",
    title: "Hematology Lab",
    count: "3 simulations",
    description: "Perform blood-cell counting and differential identification using guided microscope fields.",
    topics: ["WBC Count", "RBC Count", "DLC Count"],
    href: "/physiology/hematology",
  },
  {
    number: "02",
    title: "Amphibian Physiology",
    count: "10 simulations",
    description: "Investigate nerve–muscle preparation, skeletal muscle mechanics, and amphibian cardiac physiology.",
    topics: ["Muscle twitch", "Tetanus & fatigue", "Cardiogram"],
    href: "/physiology/amphibian-physiology",
  },
  {
    number: "03",
    title: "Microscope Master",
    count: "Interactive workspace",
    description: "Learn microscope components in 3D and move progressively through objective magnifications.",
    topics: ["3D microscope", "Stage control", "4× to 100× zoom"],
    href: "/physiology/microscope-master",
  },
  {
    number: "04",
    title: "Cardiovascular Physiology",
    count: "1 simulation",
    description: "Investigate human cardiac mechanics and correlate heart actions with pressure, volume, ECG, and sounds.",
    topics: ["Cardiac cycle", "Wiggers diagram", "Heart sounds"],
    href: "/physiology/cardiovascular",
  },
  {
    number: "05",
    title: "Neurophysiology Lab",
    count: "2 simulations",
    description: "Explore ion transport, electrochemical gradients, and electrical potentials in excitable cells.",
    topics: ["Membrane potential", "Ion gradients", "Nernst & GHK"],
    href: "/physiology/neurophysiology",
  },
  {
    number: "06",
    title: "Renal Physiology Lab",
    count: "1 simulation",
    description: "Examine urine chemistry and connect reagent-strip findings with renal and systemic physiology.",
    topics: ["Urinalysis", "Reagent pads", "Clinical interpretation"],
    href: "/physiology/renal-physiology",
  },
];

export default function PhysiologyPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <PhysiologyHeader />

      <main>
        <section className="border-y border-border bg-white">
          <div className="mx-auto max-w-6xl px-4 py-10">
            <p className="text-xs font-semibold tracking-[.1em] text-primary">PHYSIOLOGY</p>
            <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Choose a laboratory category
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
              Enter a laboratory to select the experiment or instrument you want to investigate.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10">
          <div className="mb-5 flex items-center justify-between border-b border-border pb-4">
            <h2 className="text-sm font-semibold">Laboratory categories</h2>
            <span className="text-xs text-muted">6 categories</span>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.number}
                href={category.href}
                className="group cursor-pointer rounded-lg border border-border bg-white p-5 transition-colors hover:border-primary/40 hover:bg-primary-soft focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-secondary"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-primary">{category.count}</span>
                  <span className="font-accent text-xs text-muted">{category.number}</span>
                </div>
                <h2 className="mt-5 text-lg font-semibold">{category.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted">{category.description}</p>
                <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${category.title} topics`}>
                  {category.topics.map((topic) => (
                    <li key={topic} className="rounded-sm border border-border bg-white px-2.5 py-1 text-[11px] text-muted">
                      {topic}
                    </li>
                  ))}
                </ul>
                <span className="card-action mt-5 inline-flex min-h-9 items-center rounded-md bg-primary px-3 text-xs font-semibold text-white">
                  View laboratory →
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
