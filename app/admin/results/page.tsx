import Link from "next/link";
import { redirect } from "next/navigation";
import AdminShell from "@/app/admin/admin-shell";
import AdminBreadcrumbs from "@/app/admin/breadcrumbs";
import { createClient } from "@/lib/supabase/server";
import RichTextContent from "@/app/ui/rich-text-content";
import { ArrowLeft, ExternalLink, HelpCircle } from "lucide-react";
import { simulationCatalog } from "../questions/simulation-catalog";
import AttemptsTable from "./attempts-table";
import QuizSearchList from "./quiz-search-list";
import type { QuizAttemptRow } from "./types";

type ResultsPageProps = { searchParams: Promise<{ quiz?: string }> };
type Quiz = { id: string; title: string; simulation_slug: string };
type Attempt = { id: string; score: number; total_questions: number; started_at: string; submitted_at: string | null; duration_seconds: number | null; status: string; left_at: string | null; profiles: { full_name: string | null } | { full_name: string | null }[] | null };

type QuizQuestionRow = {
  position: number;
  question_id: string;
  questions: { id: string; text: string } | { id: string; text: string }[] | null;
};
type AnswerRow = { question_id: string; is_correct: boolean };

export default async function AdminResultsPage({ searchParams }: ResultsPageProps) {
  const { quiz: selectedQuizId } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/student/questions");
  const { data: quizzes } = await supabase.from("quizzes").select("id, title, simulation_slug").order("created_at", { ascending: false });
  const { data: attempts } = selectedQuizId ? await supabase.from("quiz_attempts").select("id, score, total_questions, started_at, submitted_at, duration_seconds, status, left_at, profiles(full_name)").eq("quiz_id", selectedQuizId).order("started_at", { ascending: false }) : { data: null };
  const { data: quizQuestions } = selectedQuizId
    ? await supabase.from("quiz_questions").select("position, question_id, questions(id, text)").eq("quiz_id", selectedQuizId).order("position", { ascending: true })
    : { data: null };
  const { data: answerRows } = selectedQuizId
    ? await supabase.from("quiz_attempt_answers").select("question_id, is_correct, quiz_attempts!inner(quiz_id)").eq("quiz_attempts.quiz_id", selectedQuizId)
    : { data: null };
  const selectedQuiz = (quizzes ?? []).find((quiz) => quiz.id === selectedQuizId) as Quiz | undefined;
  const simulation = selectedQuiz
    ? simulationCatalog.find((item) => item.slug === selectedQuiz.simulation_slug)
    : undefined;

  return (
    <AdminShell>
      <div className="space-y-6">
        {selectedQuiz ? (
          <div>
            <AdminBreadcrumbs
              items={[
                { label: "Student results", href: "/admin/results" },
                { label: selectedQuiz.title },
              ]}
            />

            {/* Header with back button and quick actions */}
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Link
                    href="/admin/results"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-foreground transition"
                  >
                    <ArrowLeft className="size-3.5" />
                    Back to all quizzes
                  </Link>
                  <span className="text-muted/40">•</span>
                  <span className="rounded-md bg-primary-soft/60 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
                    {simulation?.title ?? selectedQuiz.simulation_slug}
                  </span>
                </div>
                <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {selectedQuiz.title}
                </h1>
                <p className="mt-1 text-sm text-muted">
                  Review student performance, attempt timestamps, and per-question accuracy breakdown.
                </p>
              </div>

              {/* Direct links to Quiz settings & Live Simulation */}
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/admin/quizzes/${selectedQuiz.id}`}
                  className="rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-semibold text-foreground shadow-sm transition hover:border-primary hover:text-primary"
                >
                  Manage quiz questions
                </Link>
                <Link
                  href={`/${selectedQuiz.simulation_slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-primary-dark"
                >
                  <span>Open simulation</span>
                  <ExternalLink className="size-3" />
                </Link>
              </div>
            </div>

            {/* Filterable, Sortable Attempts Table with KPI summary */}
            <div className="mt-6">
              <AttemptsTable
                attempts={(attempts ?? []) as QuizAttemptRow[]}
                totalQuizQuestions={(quizQuestions ?? []).length}
              />
            </div>

            {/* Question Accuracy Performance */}
            <QuestionPerformance
              questions={(quizQuestions ?? []) as QuizQuestionRow[]}
              answers={(answerRows ?? []) as AnswerRow[]}
            />
          </div>
        ) : (
          <div>
            <AdminBreadcrumbs items={[{ label: "Student results" }]} />
            <div className="mt-4">
              <p className="text-xs font-semibold tracking-[.14em] text-primary uppercase">Analytics & Grading</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">Student Results</h1>
              <p className="mt-1 text-sm text-muted">
                Select a quiz to inspect student submissions, completion statuses, scores, and question difficulty breakdown.
              </p>
            </div>

            <QuizSearchList quizzes={(quizzes ?? []) as Quiz[]} />
          </div>
        )}
      </div>
    </AdminShell>
  );
}

function QuestionPerformance({ questions, answers }: { questions: QuizQuestionRow[]; answers: AnswerRow[] }) {
  if (!questions.length) return null;

  const stats = new Map<string, { responses: number; correct: number }>();
  for (const answer of answers) {
    const current = stats.get(answer.question_id) ?? { responses: 0, correct: 0 };
    current.responses += 1;
    if (answer.is_correct) current.correct += 1;
    stats.set(answer.question_id, current);
  }

  return (
    <section className="mt-6 rounded-2xl border border-border bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">Question performance</h2>
        <span className="text-xs text-muted">Correct answers per question across every submitted attempt</span>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-border text-xs text-muted">
            <tr><th className="px-3 py-3">#</th><th className="px-3 py-3">Question</th><th className="px-3 py-3">Responses</th><th className="px-3 py-3">Correct</th><th className="px-3 py-3">Accuracy</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {questions.map((row, index) => {
              const question = Array.isArray(row.questions) ? row.questions[0] : row.questions;
              const stat = stats.get(row.question_id) ?? { responses: 0, correct: 0 };
              const accuracy = stat.responses ? Math.round((stat.correct / stat.responses) * 100) : null;
              return (
                <tr key={row.question_id}>
                  <td className="px-3 py-3 text-xs text-muted">{index + 1}</td>
                  <td className="max-w-[420px] px-3 py-3"><RichTextContent html={question?.text ?? "Question removed"} className="line-clamp-2 text-sm leading-6" /></td>
                  <td className="px-3 py-3 text-muted">{stat.responses}</td>
                  <td className="px-3 py-3 text-muted">{stat.correct}</td>
                  <td className="px-3 py-3 font-semibold text-primary">{accuracy === null ? "-" : `${accuracy}%`}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

