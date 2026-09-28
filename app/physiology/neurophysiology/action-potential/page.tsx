import type { Metadata } from "next";
import Link from "next/link";
import ActionPotentialSimulator from "./components/action-potential-simulator";

export const metadata: Metadata = {
  title: "Action Potential | MedLab Virtual",
  description: "Explore action-potential phases, summation, the all-or-none law, and refractory periods.",
};

export default function ActionPotentialPage() {
  return (
    <div className="min-h-dvh bg-[#0d302d] text-white">
      <header className="border-b border-white/10"><div className="mx-auto flex max-w-[1540px] items-center justify-between px-4 py-4 sm:px-6"><Link href="/physiology/neurophysiology" className="text-xs text-white/60 hover:text-white">← Neurophysiology Lab</Link><span className="font-accent text-xs text-white/45">MedLab Virtual</span></div></header>
      <main className="mx-auto max-w-[1540px] px-3 py-5 sm:px-6 sm:py-7">
        <div className="mb-5 flex flex-col justify-between gap-3 border-b border-white/10 pb-5 md:flex-row md:items-end">
          <div><p className="text-[11px] font-semibold tracking-[.12em] text-[#79c8bc]">NEUROPHYSIOLOGY · SIMULATION 02</p><h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Action Potential</h1><p className="mt-1 text-sm text-white/55">Phases · summation · all-or-none · refractory periods</p></div>
          <p className="max-w-md border-l-2 border-secondary pl-4 text-xs leading-5 text-white/55">Build an action potential from its ion-channel events, then test how stimulus timing and strength affect neuronal firing.</p>
        </div>
        <ActionPotentialSimulator />
        <p className="mt-3 text-[10px] text-white/35">Adapted under CC BY 4.0 · Access this content for free at <a href="https://www.humanbiomedia.org/action-potential-simulations-overview/" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-white/60">Human Bio Media</a>.</p>
      </main>
    </div>
  );
}
