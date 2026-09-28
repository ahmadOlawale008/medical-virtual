import Link from "next/link";
import type { ReactNode } from "react";

const HBM_URL = "https://www.humanbiomedia.org/cardiac-cycle-simulation/";

export type JumpLink = { id: string; label: string };

/**
 * Dark-teal page shell for the single-page Cardiac Cycle simulation.
 * Renders the page header, the sticky jump-nav for the article sections, the
 * white article card with the Human Bio Media content, and the CC BY 4.0
 * attribution line. The assessments are appended automatically by the root
 * layout's quiz prompt: the page has one slug, so the general quiz loads inline
 * and the phase quizzes appear in the "Other quizzes" selector.
 */
export default function SimulationShell({
  parentHref,
  parentLabel,
  kicker,
  title,
  subtitle,
  blurb,
  facts,
  jumpLinks,
  children,
}: {
  parentHref: string;
  parentLabel: string;
  kicker: string;
  title: string;
  subtitle: string;
  blurb: string;
  facts?: { label: string; value: string }[];
  jumpLinks: JumpLink[];
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-[#0d302d] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-[1540px] items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href={parentHref} className="text-xs text-white/60 transition hover:text-white">
            ← {parentLabel}
          </Link>
          <span className="font-accent text-xs text-white/45">MedLab Virtual</span>
        </div>
      </header>

      <main className="mx-auto max-w-[1540px] px-3 py-5 sm:px-6 sm:py-7">
        <div className="mb-5 flex flex-col justify-between gap-3 border-b border-white/10 pb-5 md:flex-row md:items-end">
          <div>
            <p className="text-[11px] font-semibold tracking-[.12em] text-[#79c8bc]">{kicker}</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
            <p className="mt-1 text-sm text-white/55">{subtitle}</p>
          </div>
          <p className="max-w-md border-l-2 border-secondary pl-4 text-xs leading-5 text-white/55">{blurb}</p>
        </div>

        {facts?.length ? (
          <div className="mb-5 flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-white/45">
            {facts.map((fact) => (
              <span key={fact.label}>
                <strong className="font-semibold text-white/75">{fact.value}</strong> {fact.label}
              </span>
            ))}
          </div>
        ) : null}

        <nav
          aria-label="Sections of this simulation"
          className="sticky top-0 z-30 -mx-3 border-b border-white/10 bg-[#092521]/95 px-3 py-2 backdrop-blur sm:-mx-6 sm:px-6"
        >
          <div className="flex gap-2 overflow-x-auto">
            {jumpLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70 transition hover:border-[#48d2b2]/60 hover:bg-[#48d2b2]/15 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>

        <article className="mt-5 overflow-hidden rounded-3xl border border-white/10 bg-white text-slate-800 shadow-2xl shadow-black/20">
          {children}
        </article>

        <p className="mt-3 text-[10px] text-white/35">
          Adapted under CC BY 4.0 · Access for free at{" "}
          <a
            href={HBM_URL}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-white/60"
          >
            Human Bio Media
          </a>
          .
        </p>
      </main>
    </div>
  );
}
