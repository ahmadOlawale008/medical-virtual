import Link from "next/link";
import type { ReactNode } from "react";
import { hemoglobinSaturationParts } from "../../../lab-data";

const HBM_MENU_URL =
  "https://www.humanbiomedia.org/hemoglobin-oxygen-saturation-simulation-and-altitude-menu/";

/**
 * Shared dark-teal page shell for the four Hemoglobin Oxygen Saturation parts.
 * Renders the page header, the part navigation strip, the white article card
 * with the Human Bio Media content, and the CC BY 4.0 attribution line.
 * The assessment for each part is appended automatically by the root layout's
 * quiz prompt (each part slug has its own quiz).
 */
export default function PartShell({
  number,
  title,
  subtitle,
  blurb,
  children,
}: {
  number: string;
  title: string;
  subtitle: string;
  blurb: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-[#0d302d] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-[1540px] items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link
            href="/physiology/hematology/hemoglobin-oxygen-saturation"
            className="text-xs text-white/60 transition hover:text-white"
          >
            ← Hemoglobin Oxygen Saturation
          </Link>
          <span className="font-accent text-xs text-white/45">MedLab Virtual</span>
        </div>
      </header>
      <main className="mx-auto max-w-[1540px] px-3 py-5 sm:px-6 sm:py-7">
        <div className="mb-5 flex flex-col justify-between gap-3 border-b border-white/10 pb-5 md:flex-row md:items-end">
          <div>
            <p className="text-[11px] font-semibold tracking-[.12em] text-[#79c8bc]">
              HEMATOLOGY · HEMOGLOBIN O₂ SATURATION · PART {number}
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
            <p className="mt-1 text-sm text-white/55">{subtitle}</p>
          </div>
          <p className="max-w-md border-l-2 border-secondary pl-4 text-xs leading-5 text-white/55">{blurb}</p>
        </div>

        <nav
          aria-label="Simulation parts"
          className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 xl:grid-cols-4"
        >
          {hemoglobinSaturationParts.map((part) => {
            const active = Number(part.number) === Number(number);
            return (
              <Link
                key={part.number}
                href={part.href ?? "#"}
                aria-current={active ? "page" : undefined}
                className={`p-4 text-left transition ${
                  active
                    ? "bg-[#48d2b2] text-[#092c29]"
                    : "bg-[#092521] text-white/55 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span
                  className={`text-[10px] font-bold tracking-[.14em] ${
                    active ? "text-[#0d5149]" : "text-[#79c8bc]"
                  }`}
                >
                  PART {Number(part.number)}
                </span>
                <span className="mt-1 block text-sm font-semibold">{part.shortTitle ?? part.title}</span>
              </Link>
            );
          })}
        </nav>

        <article className="mt-5 overflow-hidden rounded-3xl border border-white/10 bg-white text-slate-800 shadow-2xl shadow-black/20">
          {children}
        </article>

        <p className="mt-3 text-[10px] text-white/35">
          Adapted under CC BY 4.0 · Access for free at{" "}
          <a
            href={HBM_MENU_URL}
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
