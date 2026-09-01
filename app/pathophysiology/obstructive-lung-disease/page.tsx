import type { Metadata } from "next";
import Link from "next/link";
import LungSimulator from "./components/lung-simulator";

export const metadata: Metadata = { title: "Obstructive Lung Disease Simulator | MedLab Virtual", description: "Explore airflow obstruction, air trapping, and gas exchange." };

export default function ObstructiveLungDiseasePage() {
  return (
    <div className="min-h-dvh bg-[#0d302d] text-white">
      <header className="mx-auto flex h-16 max-w-[1540px] items-center justify-between px-4 sm:px-6"><Link className="font-accent font-bold" href="/">MedLab Virtual</Link><Link className="cursor-pointer text-sm font-semibold text-white/70 hover:text-white" href="/pathophysiology">← Pathophysiology labs</Link></header>
      <main className="mx-auto flex max-w-[1540px] flex-col gap-4 px-4 pb-6 sm:px-6">
        <section className="flex flex-col gap-3 border-y border-white/15 py-5 lg:flex-row lg:items-center lg:justify-between"><div><p className="text-xs font-semibold tracking-[.1em] text-[#8fd0c4]">PATHOPHYSIOLOGY · SIMULATION 02</p><h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Obstructive lung disease</h1></div><p className="max-w-xl border-l-2 border-secondary pl-4 text-sm leading-6 text-white/65">Narrow the airways, reduce elastic recoil, and impair gas exchange. Watch the forced expiratory loop and pulmonary values respond.</p></section>
        <LungSimulator />
        <p className="pb-2 text-[11px] text-white/35">Educational model based on spirometry principles from NHLBI and GOLD. Not for clinical interpretation.</p>
      </main>
    </div>
  );
}
