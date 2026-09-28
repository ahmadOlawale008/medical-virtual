import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import HematocritCaseStudies, { type CaseStudy } from "./components/hematocrit-case-studies";

const SIMULATION_SLUG = "physiology/hematology/hematocrit-case-studies";

export const metadata: Metadata = {
  title: "Hematocrit Case Studies | MedLab Virtual",
  description: "Measure and interpret hematocrit values in eight simulated clinical cases.",
};

function EmptyState({ signedIn }: { signedIn: boolean }) {
  return (
    <section className="rounded-[18px] border border-white/10 bg-[#0f3a36] p-6 text-white">
      <h2 className="text-lg font-semibold">
        {signedIn ? "No case studies published yet" : "Sign in to view the case studies"}
      </h2>
      <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">
        {signedIn
          ? "An administrator has not published case studies for this simulation yet."
          : "The eight simulated patients and their assessments are available to signed-in students."}
      </p>
      {!signedIn && (
        <Link
          href="/auth/login?next=%2Fphysiology%2Fhematology%2Fhematocrit-case-studies"
          className="mt-5 inline-flex rounded-xl bg-[#48d2b2] px-5 py-3 text-sm font-bold text-[#092c29] transition hover:bg-[#64ddc1]"
        >
          Sign in →
        </Link>
      )}
    </section>
  );
}

export default async function HematocritCaseStudiesPage() {
  const supabase = await createClient();
  const [{ data: { user } }, { data: caseStudies }] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from("case_studies")
      .select("id, title, patient_name, patient_initials, patient_identity, scenario, tube_hct, image_url, image_alt, position, quizzes(id, title, published)")
      .eq("simulation_slug", SIMULATION_SLUG)
      .eq("published", true)
      .order("position", { ascending: true }),
  ]);

  const cases = (caseStudies ?? []) as CaseStudy[];

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
            <p className="text-[11px] font-semibold tracking-[.12em] text-[#79c8bc]">HEMATOLOGY · SIMULATION 05</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Hematocrit Case Studies</h1>
            <p className="mt-1 text-sm text-white/55">Clinical interpretation · eight simulated patients</p>
          </div>
          <p className="max-w-md border-l-2 border-secondary pl-4 text-xs leading-5 text-white/55">
            Measure each capillary tube, classify the result, and connect the abnormal value with the patient&apos;s presentation.
          </p>
        </div>

        {cases.length > 0 ? <HematocritCaseStudies cases={cases} /> : <EmptyState signedIn={Boolean(user)} />}

        <p className="mt-3 text-[10px] text-white/35">
          Adapted under CC BY 4.0 · Access for free at <a className="underline underline-offset-2 hover:text-white/60" href="https://www.humanbiomedia.org/hematocrit-simulated-case-studies/" target="_blank" rel="noreferrer">Human Bio Media</a>.
        </p>
      </main>
    </div>
  );
}

