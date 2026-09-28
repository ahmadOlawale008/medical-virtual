"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

/** Same activity host the hematocrit simulator already embeds. */
const activityRoot = "https://humanbiomedia.org/simulations/circulatory-system/hematocrit";

export type CaseStudy = {
  id: string;
  title: string;
  patient_name: string | null;
  patient_initials: string | null;
  patient_identity: string | null;
  scenario: string;
  tube_hct: number | null;
  image_url: string | null;
  image_alt: string | null;
  quizzes?: { id: string; title: string }[] | null;
};

export default function HematocritCaseStudies({ cases }: { cases: CaseStudy[] }) {
  const [caseIndex, setCaseIndex] = useState(0);
  const patient = cases[caseIndex];

  if (!patient) {
    return (
      <section className="rounded-[18px] border border-white/10 bg-[#0f3a36] p-6 text-sm leading-6 text-[#dff7f1]">
        No case studies have been published for this simulation yet. An administrator can add them
        from the question bank.
      </section>
    );
  }

  const quiz = patient.quizzes?.[0];

  return (
    <section className="overflow-hidden rounded-[18px] border border-[#5ea9a0] bg-[#0f3a36] shadow-[0_18px_36px_rgba(4,16,15,0.28)]">
      <div className="border-b border-white/10 p-4 sm:p-5">
        <p className="text-[10px] font-semibold tracking-[.14em] text-[#79c8bc]">
          SELECT A CASE STUDY
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {cases.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCaseIndex(index)}
              aria-pressed={caseIndex === index}
              className={`rounded-xl border px-3 py-3 text-left transition ${
                caseIndex === index
                  ? "border-[#48d2b2] bg-[#48d2b2]/12 text-white"
                  : "border-white/10 bg-[#103c36] text-white/70 hover:border-[#48d2b2]/50 hover:text-white"
              }`}
            >
              <span className="text-[10px] font-semibold tracking-[.12em] text-[#79c8bc]">
                CASE {index + 1}
              </span>
              <span className="mt-1 block text-xs font-semibold">
                {item.patient_name ?? item.title}
              </span>
              <span className="mt-0.5 block text-[10px] text-white/45">
                {item.title.replace(/^Case \d+:\s*/, "")}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 p-4 sm:p-5 xl:grid-cols-[1.15fr_1fr]">
        <div className="rounded-2xl border border-white/10 bg-[#0b2d2b] p-4 text-white">
          <div className="flex items-start gap-4">
            {patient.image_url ? (
              <Image
                src={patient.image_url}
                alt={patient.image_alt ?? `Illustration for ${patient.patient_name ?? patient.title}`}
                width={512}
                height={512}
                className="size-24 shrink-0 rounded-xl border border-white/10 object-cover sm:size-28"
              />
            ) : (
              patient.patient_initials && (
                <span
                  aria-hidden="true"
                  className="grid size-24 shrink-0 place-items-center rounded-xl bg-[#48d2b2] text-base font-bold text-[#0d302d] sm:size-28"
                >
                  {patient.patient_initials}
                </span>
              )
            )}
            <div>
              <h2 className="text-lg font-semibold leading-6">{patient.patient_name ?? patient.title}</h2>
              <p className="mt-1 text-xs text-white/55">{patient.patient_identity}</p>
              <p className="mt-2 text-[11px] text-[#79c8bc]">{patient.title}</p>
            </div>
          </div>
          <p className="mt-4 rounded-xl border border-white/10 bg-[#103c36] p-3 text-sm leading-6 text-[#dff7f1]">
            {patient.scenario}
          </p>

          {patient.tube_hct !== null && (
            <div className="mt-4">
              <p className="text-[10px] font-semibold tracking-[.14em] text-[#79c8bc]">DETERMINE HCT VALUE</p>
              <p className="mt-1 text-xs leading-5 text-white/50">
                Slide the tube until the top of the plasma is level with the 100% line, then read the value.
              </p>
              <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-white">
                <iframe
                  key={patient.tube_hct}
                  src={`${activityRoot}/hct-value-${patient.tube_hct}-percent.html`}
                  title={`${patient.tube_hct}% hematocrit case`}
                  className="block h-[520px] w-full border-0"
                />
              </div>
            </div>
          )}

          <Link
            href="/physiology/hematology/hematocrit"
            className="mt-4 inline-flex text-xs font-semibold text-[#79c8bc] underline underline-offset-4 transition hover:text-white"
          >
            Open the hematocrit test simulation →
          </Link>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#103c36] p-5 text-white">
          <p className="text-[10px] font-semibold tracking-[.14em] text-[#79c8bc]">ASSESSMENT</p>
          <h3 className="mt-3 text-xl font-semibold">Interpret this patient&apos;s result</h3>
          <p className="mt-3 text-sm leading-6 text-white/60">
            Use the reader on the left to measure this patient&apos;s capillary tube, then answer five
            questions on the value, its classification, and the clinical reasoning behind it. Your score
            is recorded and your instructor can review your answers.
          </p>
          <ul className="mt-4 space-y-2 text-xs text-white/55">
            <li>· Question 1 — determine the hematocrit value from the reader</li>
            <li>· Question 2 — classify the value for this patient</li>
            <li>· Questions 3–5 — symptoms, mechanism, and management</li>
          </ul>
          {quiz ? (
            <Link
              href={`/quiz?quiz=${encodeURIComponent(quiz.id)}`}
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[#48d2b2] px-4 py-3 text-sm font-bold text-[#092c29] transition hover:bg-[#64ddc1]"
            >
              Start this case assessment →
            </Link>
          ) : (
            <p className="mt-6 rounded-xl border border-amber-300/30 bg-amber-400/10 px-4 py-3 text-xs leading-5 text-amber-200">
              No quiz is published for this case yet. An administrator needs to attach questions to it.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
