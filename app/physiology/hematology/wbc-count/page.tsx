import type { Metadata } from "next";
import Link from "next/link";
import WbcSimulator from "./components/wbc-simulator";

export const metadata: Metadata = {
  title: "WBC Count (TLC) | MedLab Virtual",
  description: "Interactive total leukocyte count simulation using an improved Neubauer chamber.",
};

export default function WbcCountPage() {
  return (
    <div className="min-h-dvh bg-[#0d302d] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-[1540px] items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link
            href="/physiology/hematology"
            className="text-xs text-white/60 transition hover:text-white"
          >
            ← Hematology Lab
          </Link>
          <span className="font-accent text-xs text-white/45">MedLab Virtual</span>
        </div>
      </header>

      <main className="mx-auto max-w-[1540px] px-3 py-5 sm:px-6 sm:py-7">
        <div className="mb-5 flex flex-col justify-between gap-3 border-b border-white/10 pb-5 md:flex-row md:items-end">
          <div>
            <p className="text-[11px] font-semibold tracking-[.12em] text-[#79c8bc]">HEMATOLOGY · SIMULATION 01</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">WBC Count (TLC)</h1>
            <p className="mt-1 text-sm text-white/55">Total leukocyte count · Improved Neubauer chamber</p>
          </div>
          <p className="max-w-md border-l-2 border-secondary pl-4 text-xs leading-5 text-white/55">
            Choose an objective, inspect each corner square, and select every visible leukocyte to calculate the sample concentration.
          </p>
        </div>

        <WbcSimulator />

        <p className="mt-3 text-[10px] text-white/35">
          Educational simulation · 1:20 dilution · chamber depth 0.1 mm · not for clinical diagnosis
        </p>
      </main>
    </div>
  );
}
