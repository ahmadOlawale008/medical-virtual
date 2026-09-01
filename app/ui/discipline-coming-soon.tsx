import Link from "next/link";

type Props = {
  discipline: string;
  description: string;
  plannedLabs: string[];
};

export default function DisciplineComingSoon({
  discipline,
  description,
  plannedLabs,
}: Props) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link className="font-accent font-bold" href="/">
          MedLab Virtual
        </Link>
        <Link className="cursor-pointer text-sm font-semibold text-primary" href="/">
          ← All disciplines
        </Link>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-12">
        <p className="text-xs font-semibold tracking-[0.1em] text-primary">
          {discipline.toUpperCase()}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Laboratories coming soon
        </h1>
        <p className="mt-4 max-w-2xl leading-7 text-muted">{description}</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {plannedLabs.map((lab) => (
            <div key={lab} className="rounded-lg border border-border bg-white p-5">
              <p className="text-xs text-muted">Planned simulation</p>
              <h2 className="mt-3 text-base font-semibold">{lab}</h2>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
