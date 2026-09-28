import type { Metadata } from "next";
import Link from "next/link";
import ConductionSimulator from "./components/conduction-simulator";

export const metadata: Metadata = {
  title: "Conduction Velocity | MedLab Virtual",
  description: "Stimulate two points on the frog sciatic nerve, compare latent periods, and calculate conduction velocity.",
};

export default function ConductionVelocityPage() {
  return (
    <div className="min-h-dvh bg-[#0b1c27] text-white">
      <header className="border-b border-white/10 bg-[#0d302d]">
        <div className="mx-auto flex min-h-[74px] max-w-[1900px] items-center justify-between gap-5 px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Link href="/physiology/amphibian-physiology" className="text-xs text-white/55 transition hover:text-white">← Amphibian physiology</Link>
            <span className="hidden h-5 w-px bg-white/10 sm:block" />
            <div>
              <p className="text-[10px] font-semibold tracking-[.12em] text-[#76aaff]">EXPERIMENT 08</p>
              <h1 className="mt-1 text-lg font-semibold">Conduction Velocity</h1>
            </div>
          </div>
          <p className="hidden font-accent text-xs text-white/40 md:block">Sciatic nerve · frog</p>
        </div>
      </header>
      <ConductionSimulator />
    </div>
  );
}
