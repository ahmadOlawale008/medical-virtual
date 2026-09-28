import Link from "next/link";
import type { PhysiologyExperiment } from "../lab-data";

export default function ExperimentList({
  experiments,
  cardLabel = "EXPERIMENT",
  actionLabel = "Open simulation",
}: {
  experiments: PhysiologyExperiment[];
  cardLabel?: string;
  actionLabel?: string;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {experiments.map((experiment) => (
        experiment.href ? (
          <Link
            key={experiment.number}
            href={experiment.href}
            className="group rounded-lg border border-border bg-white p-5 transition-colors hover:border-primary/35 hover:bg-primary-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <ExperimentCard experiment={experiment} cardLabel={cardLabel} action={actionLabel} />
          </Link>
        ) : (
          <article
            key={experiment.number}
            className="group rounded-lg border border-border bg-white p-5 transition-colors hover:border-primary/35 hover:bg-primary-soft"
          >
            <ExperimentCard experiment={experiment} cardLabel={cardLabel} action="Simulation planned" />
          </article>
        )
      ))}
    </div>
  );
}

function ExperimentCard({
  experiment,
  cardLabel,
  action,
}: {
  experiment: PhysiologyExperiment;
  cardLabel: string;
  action: string;
}) {
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-semibold tracking-[.08em] text-primary">
          {cardLabel}
        </span>
        <span className="font-accent text-xs text-muted">{experiment.number}</span>
      </div>
      <h2 className="mt-4 text-base font-semibold leading-6">{experiment.title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted">{experiment.description}</p>
      <span className="card-action mt-5 inline-flex min-h-8 items-center rounded-md border border-border bg-white px-3 text-[11px] font-semibold text-muted">
        {action}
      </span>
    </>
  );
}
