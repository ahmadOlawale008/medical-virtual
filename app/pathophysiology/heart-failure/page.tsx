import type { Metadata } from "next";
import Link from "next/link";
import HeartFailureSimulator from "../components/heart-failure-simulator";

export const metadata: Metadata = {
  title: "Heart Failure Simulator | MedLab Virtual",
  description: "Explore heart failure hemodynamics and compensation.",
};

export default function HeartFailurePage() {
  return (
    <div className="min-h-dvh bg-[#0d302d] text-white">
      <header className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6">
        <Link className="font-accent font-bold" href="/">
          MedLab Virtual
        </Link>
        <Link
          className="cursor-pointer text-sm font-semibold text-white/70 hover:text-white"
          href="/pathophysiology"
        >
          ← Pathophysiology labs
        </Link>
      </header>
      <main className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 pb-6 sm:px-6">
        <section className="flex flex-col gap-3 border-y border-white/15 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[.1em] text-[#8fd0c4]">
              PATHOPHYSIOLOGY · SIMULATION 01
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Heart failure &amp; compensatory mechanisms
            </h1>
          </div>
          <p className="max-w-xl border-l-2 border-secondary pl-4 text-sm leading-6 text-white/65">
            Reduce ventricular contractility, then adjust rate, resistance, and
            volume to preserve perfusion without causing congestion.
          </p>
        </section>
        <HeartFailureSimulator />
      </main>
    </div>
  );
}
