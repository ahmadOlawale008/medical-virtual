"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { simulationCatalog } from "@/app/admin/questions/simulation-catalog";
import QuizRunner, { type QuizQuestion } from "./quiz-runner";

type Quiz = {
  id: string;
  title: string;
  time_limit_seconds: number | null;
  show_result_after_submit: boolean;
};

const isGeneralQuiz = (quiz: { title: string }) => quiz.title.trim().toLowerCase() === "general quiz";

export default function SimulationQuizPrompt() {
  const pathname = usePathname();
  const router = useRouter();
  const [state, setState] = useState<"loading" | "signed-out" | "empty" | "available">("loading");
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [generalQuestions, setGeneralQuestions] = useState<QuizQuestion[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<string>("");
  // Tracks which simulation slug the loaded quiz data belongs to, so a
  // still-mounted prompt never renders the previous part's quiz on navigation.
  const [loadedSlug, setLoadedSlug] = useState<string | null>(null);

  const simulation = simulationCatalog.find((item) => `/${item.slug}` === pathname);
  const simulationSlug = simulation?.slug;

  useEffect(() => {
    if (!simulationSlug) return;

    let active = true;
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        if (active) {
          setLoadedSlug(simulationSlug ?? null);
          setState("signed-out");
        }
        return;
      }

      const { data } = await supabase
        .from("quizzes")
        .select("id, title, time_limit_seconds, show_result_after_submit")
        .eq("simulation_slug", simulationSlug)
        .eq("published", true)
        .order("created_at", { ascending: false });
      const available = (data ?? []) as Quiz[];
      if (!active) return;

      // The General quiz is answered inline on this page; other quizzes open full screen.
      const general = available.find(isGeneralQuiz);
      let questions: QuizQuestion[] = [];
      if (general) {
        const { data: rows } = await supabase
          .from("quiz_questions")
          .select("position, questions(id, text, explanation, case_studies(id, title, patient_name, patient_initials, patient_identity, scenario), question_options(id, option_text))")
          .eq("quiz_id", general.id)
          .order("position", { ascending: true });
        // The embedded relation is typed loosely by the client, so map then narrow.
        const mapped = (rows ?? []).map((row) => row.questions).filter(Boolean);
        questions = mapped as unknown as QuizQuestion[];
      }
      if (!active) return;

      setSelectedQuizId("");
      setQuizzes(available);
      setGeneralQuestions(questions);
      setLoadedSlug(simulationSlug ?? null);
      setState(available.length ? "available" : "empty");
    }

    void load();
    return () => {
      active = false;
    };
  }, [simulationSlug]);

  if (!simulation || state === "loading" || state === "empty" || loadedSlug !== simulationSlug) return null;

  const signedOut = state === "signed-out";
  const general = quizzes.find(isGeneralQuiz);
  const others = quizzes.filter((quiz) => !isGeneralQuiz(quiz));
  const showInlineQuiz = !signedOut && general !== undefined && generalQuestions.length > 0;

  return (
    <section className="border-t border-white/10 bg-[#092521] px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-[1540px]">
        <p className="text-[11px] font-semibold tracking-[.14em] text-[#79c8bc]">ASSESS YOUR UNDERSTANDING</p>
        <h2 className="mt-2 text-xl font-semibold">{simulation.title} quiz</h2>
        <p className="mt-2 text-sm leading-6 text-white/60">
          {signedOut
            ? "Sign in or create a student account to answer the questions for this simulation and have your score recorded."
            : "Answer every question, then submit to record your score. Your instructor can review your answers."}
        </p>
        {signedOut && (
          <Link
            href={`/auth/login?next=${encodeURIComponent(pathname)}`}
            className="mt-5 inline-flex rounded-xl bg-[#48d2b2] px-5 py-3 text-sm font-bold text-[#092c29] transition hover:bg-[#64ddc1]"
          >
            Sign in to take the quiz →
          </Link>
        )}
      </div>

      {showInlineQuiz && general && (
        <div className="mt-6">
          <QuizRunner
            key={`${simulationSlug}:${general.id}`}
            embedded
            quizId={general.id}
            questions={generalQuestions}
            simulationTitle={simulation.title}
            simulationSlug={simulation.slug}
            timeLimitSeconds={general.time_limit_seconds}
            showResultAfterSubmit={general.show_result_after_submit}
          />
        </div>
      )}

      {!signedOut && !showInlineQuiz && general === undefined && others.length === 0 && (
        <p className="mx-auto mt-6 max-w-[1540px] rounded-xl border border-amber-300/30 bg-amber-400/10 px-4 py-3 text-xs leading-5 text-amber-200">
          No questions have been published for this simulation yet.
        </p>
      )}

      {!signedOut && others.length > 0 && (
        <div className="mx-auto mt-6 max-w-[1540px] rounded-2xl border border-white/10 bg-[#0c312c] p-4 sm:p-5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold tracking-[.14em] text-[#79c8bc]">OTHER QUIZZES</p>
              <p className="text-xs text-white/55">
                Specialized & case assessments (opens in monitored full-screen mode).
              </p>
            </div>
          </div>

          <div className="mt-3.5 flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1">
              <select
                aria-label="Select an assessment quiz"
                value={selectedQuizId || others[0]?.id || ""}
                onChange={(e) => setSelectedQuizId(e.target.value)}
                className="w-full cursor-pointer appearance-none rounded-xl border border-white/15 bg-[#103c36] px-3.5 py-2.5 pr-9 text-sm font-medium text-white shadow-inner transition hover:border-[#48d2b2]/50 focus:border-[#48d2b2] focus:outline-none"
              >
                {others.map((quiz) => (
                  <option key={quiz.id} value={quiz.id} className="bg-[#0c312c] text-white py-1">
                    {quiz.title} {quiz.time_limit_seconds ? `(${Math.round(quiz.time_limit_seconds / 60)} min)` : ""}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-white/60">
                <svg className="size-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const targetId = selectedQuizId || others[0]?.id;
                if (targetId) {
                  router.push(`/quiz?quiz=${encodeURIComponent(targetId)}`);
                }
              }}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#48d2b2] px-4 py-2.5 text-sm font-bold text-[#092c29] transition hover:bg-[#64ddc1]"
            >
              <span>Take Quiz</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}