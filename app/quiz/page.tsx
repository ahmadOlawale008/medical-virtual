import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { simulationCatalog } from "@/app/admin/questions/simulation-catalog";
import QuizRunner, { QuizQuestion } from "./quiz-runner";

type QuizPageProps = {
  searchParams: Promise<{ simulation?: string; quiz?: string }>;
};

export default async function QuizPage({ searchParams }: QuizPageProps) {
  const { simulation, quiz: quizId } = await searchParams;
  const supabase = await createClient();
  const { data: selectedQuiz } = quizId
    ? await supabase.from("quizzes").select("id, title, simulation_slug, time_limit_seconds, one_time_use, show_result_after_submit").eq("id", quizId).maybeSingle()
    : { data: null };
  const resolvedSimulation = selectedQuiz?.simulation_slug ?? simulation;
  const simulationInfo = simulationCatalog.find((item) => item.slug === resolvedSimulation);
  if (!simulationInfo) redirect("/");
  const simulationSlug = simulationInfo.slug;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/auth/login?next=${encodeURIComponent(quizId ? `/quiz?quiz=${quizId}` : `/quiz?simulation=${simulationSlug}`)}`);

  if (selectedQuiz?.one_time_use) {
    const { data: previousAttempt } = await supabase.from("quiz_attempts").select("id").eq("quiz_id", selectedQuiz.id).eq("student_id", user.id).eq("status", "completed").maybeSingle();
    if (previousAttempt) {
      return <div className="min-h-dvh bg-background"><header className="border-b border-border bg-white"><div className="mx-auto flex h-16 max-w-3xl items-center px-4"><Link href={`/${simulationSlug}`} className="text-sm font-semibold text-primary">← Back to simulation</Link></div></header><main className="mx-auto max-w-2xl px-4 py-20 text-center"><h1 className="text-2xl font-semibold">This quiz has already been completed</h1><p className="mt-3 text-sm text-muted">This is a one-time quiz and cannot be retaken.</p></main></div>;
    }
  }

  let questions: unknown[] = [];
  if (selectedQuiz) {
    const { data: quizQuestions } = await supabase
      .from("quiz_questions")
      .select("position, questions(id, text, explanation, case_studies(id, title, patient_name, patient_initials, patient_identity, scenario), question_options(id, option_text))")
      .eq("quiz_id", selectedQuiz.id)
      .order("position", { ascending: true });
    questions = (quizQuestions ?? []).map((item) => item.questions).filter(Boolean);
  }

  const { data: settings } = selectedQuiz ? { data: null } : await supabase
    .from("simulation_quiz_settings")
    .select("time_limit_seconds")
    .eq("simulation_slug", simulationSlug)
    .maybeSingle();

  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
          <Link href={`/${simulationSlug}`} className="text-sm font-semibold text-primary">← Back to simulation</Link>
          <span className="font-accent text-xs text-muted">MedLab Virtual</span>
        </div>
      </header>
      {questions && questions.length > 0 ? (
        <QuizRunner quizId={selectedQuiz?.id} simulationTitle={selectedQuiz?.title ?? simulationInfo.title} simulationSlug={simulationSlug} questions={questions as QuizQuestion[]} timeLimitSeconds={selectedQuiz?.time_limit_seconds ?? settings?.time_limit_seconds ?? null} showResultAfterSubmit={selectedQuiz?.show_result_after_submit ?? true} />
      ) : (
        <main className="mx-auto max-w-2xl px-4 py-20 text-center">
          <h1 className="text-2xl font-semibold">No quiz published yet</h1>
          <p className="mt-3 text-sm text-muted">An administrator has not added questions for this simulation.</p>
          <Link href={`/${simulationSlug}`} className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white">Back to simulation</Link>
        </main>
      )}
    </div>
  );
}
