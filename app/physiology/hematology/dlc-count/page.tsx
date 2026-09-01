import type { Metadata } from "next";
import Link from "next/link";
import DlcSimulator from "./components/dlc-simulator";

export const metadata: Metadata = {
  title: "DLC Count | MedLab Virtual",
  description: "Interactive differential leukocyte count using a virtual peripheral blood smear.",
};

export default function DlcCountPage() {
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
            <p className="text-[11px] font-semibold tracking-[.12em] text-[#79c8bc]">HEMATOLOGY · SIMULATION 03</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">DLC Count</h1>
            <p className="mt-1 text-sm text-white/55">Differential leukocyte count · Peripheral blood smear</p>
          </div>
          <p className="max-w-md border-l-2 border-secondary pl-4 text-xs leading-5 text-white/55">
            Scan the smear, identify 100 leukocytes by morphology, and record the five-part differential.
          </p>
        </div>

        <DlcSimulator />

        <p className="mt-3 text-[10px] text-white/35">
          Educational simulation · Wright–Giemsa-style staining · not for clinical diagnosis
        </p>
      </main>
    </div>
  );
}
