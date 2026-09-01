import type { Metadata } from "next";
import Link from "next/link";
import ShockSimulator from "./components/shock-simulator";

export const metadata: Metadata = {
  title: "Circulatory Shock Simulator | MedLab Virtual",
  description: "Compare hypovolemic, cardiogenic, distributive, and obstructive shock.",
};

export default function CirculatoryShockPage() {
  return (
    <div className="min-h-dvh bg-[#0d302d] text-white">
      <header className="mx-auto flex h-16 max-w-[1540px] items-center justify-between px-4 sm:px-6">
        <Link className="font-accent font-bold" href="/">
          MedLab Virtual
        </Link>
        <Link className="cursor-pointer text-sm font-semibold text-white/70 hover:text-white" href="/pathophysiology">
          ← Pathophysiology labs
        </Link>
      </header>

      <main className="mx-auto flex max-w-[1540px] flex-col gap-4 px-4 pb-6 sm:px-6">
        <section className="flex flex-col gap-3 border-y border-white/15 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[.1em] text-[#a4d9d0]">
              PATHOPHYSIOLOGY · SIMULATION 05
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Circulatory shock
            </h1>
          </div>
          <p className="max-w-xl border-l-2 border-secondary pl-4 text-sm leading-6 text-white/65">
            Change volume, pump function, vascular tone, or outflow. Watch the animated circulation and organ perfusion respond.
          </p>
        </section>

        <ShockSimulator />
        <p className="pb-2 text-[11px] text-white/35">
          Educational hemodynamic model. Values demonstrate physiological relationships and are not for clinical interpretation.
        </p>
      </main>
    </div>
  );
}
