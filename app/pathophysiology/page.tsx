import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pathophysiology Laboratories | MedLab Virtual",
  description: "Browse interactive pathophysiology simulations by organ system.",
};

const laboratories = [
  {
    number: "01",
    system: "Cardiovascular",
    title: "Heart failure & compensatory mechanisms",
    description:
      "Alter ventricular function, preload, afterload, and heart rate while monitoring systemic hemodynamics.",
    href: "/pathophysiology/heart-failure",
    available: true,
  },
  {
    number: "02",
    system: "Respiratory",
    title: "Obstructive lung disease",
    description:
      "Explore airway resistance, expiratory flow limitation, and impaired gas exchange.",
    href: "/pathophysiology/obstructive-lung-disease",
    available: true,
  },
  {
    number: "03",
    system: "Renal",
    title: "Acute kidney injury",
    description:
      "Compare prerenal, intrinsic, and postrenal changes in filtration and laboratory values.",
    href: "/pathophysiology/acute-kidney-injury",
    available: true,
  },
  {
    number: "04",
    system: "Endocrine",
    title: "Diabetic ketoacidosis",
    description:
      "Observe the relationship between insulin deficiency, ketones, acidosis, and fluid loss.",
    href: "/pathophysiology/diabetic-ketoacidosis",
    available: true,
  },
  {
    number: "05",
    system: "Multisystem",
    title: "Circulatory shock",
    description:
      "Investigate pressure, perfusion, oxygen delivery, and progressive organ dysfunction.",
    href: "/pathophysiology/circulatory-shock",
    available: true,
  },
];

function LaboratoryContent({ laboratory }: { laboratory: (typeof laboratories)[number] }) {
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-primary">
          {laboratory.system}
        </span>
        <span className="font-accent text-xs text-muted">
          {laboratory.number}
        </span>
      </div>
      <h2 className="mt-5 text-lg font-semibold leading-6">
        {laboratory.title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted">
        {laboratory.description}
      </p>
      <span
        className={`card-action mt-5 inline-flex min-h-9 items-center rounded-md px-3 text-xs font-semibold ${
          laboratory.available
            ? "bg-primary text-white"
            : "border border-border bg-white text-muted"
        }`}
      >
        {laboratory.available ? "Open simulation →" : "Coming soon"}
      </span>
    </>
  );
}

export default function PathophysiologyPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link className="font-accent font-bold" href="/">
          MedLab Virtual
        </Link>
        <Link
          className="cursor-pointer text-sm font-semibold text-primary"
          href="/"
        >
          ← All disciplines
        </Link>
      </header>

      <main>
        <section className="border-y border-border bg-white">
          <div className="mx-auto max-w-6xl px-4 py-10">
            <p className="text-xs font-semibold tracking-[0.1em] text-primary">
              PATHOPHYSIOLOGY
            </p>
            <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Choose a disease mechanism to investigate
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
              Run system-based simulations and observe how altered physiology
              changes pressures, flows, laboratory values, and organ function.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10">
          <div className="mb-5 flex items-center justify-between border-b border-border pb-4">
            <h2 className="text-sm font-semibold">Laboratories</h2>
            <span className="text-xs text-muted">5 available</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {laboratories.map((laboratory) =>
              laboratory.available && laboratory.href ? (
                <Link
                  key={laboratory.number}
                  href={laboratory.href}
                  className="group cursor-pointer rounded-lg border border-primary/30 bg-primary-soft p-5 transition-colors hover:border-primary focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-secondary"
                >
                  <LaboratoryContent laboratory={laboratory} />
                </Link>
              ) : (
                <article
                  key={laboratory.number}
                  className="group rounded-lg border border-border bg-white p-5 transition-colors hover:border-primary/30 hover:bg-primary-soft"
                >
                  <LaboratoryContent laboratory={laboratory} />
                </article>
              ),
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
