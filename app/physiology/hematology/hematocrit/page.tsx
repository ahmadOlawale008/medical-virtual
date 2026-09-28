import type { Metadata } from "next";
import Link from "next/link";
import HematocritSimulator from "./components/hematocrit-simulator";

export const metadata: Metadata = {
  title: "Hematocrit Test | MedLab Virtual",
  description: "Prepare, centrifuge, and read a capillary blood sample to determine packed cell volume.",
};

export default function HematocritPage() {
  return (
    <div className="min-h-dvh bg-[#0d302d] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-[1540px] items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/physiology/hematology" className="text-xs text-white/60 transition hover:text-white">
            ← Hematology Lab
          </Link>
          <span className="font-accent text-xs text-white/45">MedLab Virtual</span>
        </div>
      </header>

      <main className="mx-auto max-w-[1540px] px-3 py-5 sm:px-6 sm:py-7">
        <div className="mb-5 flex flex-col justify-between gap-3 border-b border-white/10 pb-5 md:flex-row md:items-end">
          <div>
            <p className="text-[11px] font-semibold tracking-[.12em] text-[#79c8bc]">HEMATOLOGY · SIMULATION 04</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Hematocrit Test</h1>
            <p className="mt-1 text-sm text-white/55">Microhematocrit method · packed cell volume</p>
          </div>
          <p className="max-w-md border-l-2 border-secondary pl-4 text-xs leading-5 text-white/55">
            Prepare a capillary sample, separate its blood components, and measure the red-cell fraction on a reader card.
          </p>
        </div>

        <HematocritSimulator />

        <p className="mt-3 text-[10px] text-white/35">
          Educational simulation · compressed centrifuge timing · not for clinical diagnosis · procedure adapted from{" "}
          <a href="https://www.humanbiomedia.org/hematocrit-lab-simulation/" target="_blank" rel="noreferrer" className="underline decoration-white/20 underline-offset-2 hover:text-white/60">
            Human Bio Media
          </a>
        </p>
      </main>
    </div>
  );
}
