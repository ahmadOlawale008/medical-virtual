"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { createClient } from "@/lib/supabase/client";
import RichTextContent from "@/app/ui/rich-text-content";

type QuizOption = { id: string; option_text: string };

export type QuizCaseStudy = {
  id: string;
  title: string;
  patient_name: string | null;
  patient_initials: string | null;
  patient_identity: string | null;
  scenario: string;
};

export type QuizQuestion = {
  id: string;
  text: string;
  explanation: string | null;
  question_options: QuizOption[];
  case_studies?: QuizCaseStudy | QuizCaseStudy[] | null;
};

/** PostgREST returns an embedded to-one relation as an object, but tolerate arrays. */
export function resolveCaseStudy(question: QuizQuestion): QuizCaseStudy | null {
  const value = question.case_studies;
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

/**
 * Module scope so the effect below can call it without a changing dependency.
 */
async function insertAttempt(
  supabase: ReturnType<typeof createClient>,
  payload: { student_id: string; quiz_id: string | null; simulation_slug: string; total_questions: number },
) {
  const { data } = await supabase.from("quiz_attempts").insert(payload).select("id").single();
  return data?.id ?? null;
}

export default function QuizRunner({
  quizId,
  questions,
  simulationTitle,
  simulationSlug,
  timeLimitSeconds,
  showResultAfterSubmit,
  embedded = false,
}: {
  quizId?: string;
  questions: QuizQuestion[];
  simulationTitle: string;
  simulationSlug: string;
  timeLimitSeconds: number | null;
  showResultAfterSubmit: boolean;
  /** Renders inline below a simulation instead of a monitored full-screen page. */
  embedded?: boolean;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(timeLimitSeconds);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [leftPage, setLeftPage] = useState(false);
  const [serverScore, setServerScore] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const quizRef = useRef<HTMLElement>(null);
  const attemptId = useRef<string | null>(null);
  const startedAt = useRef<number | null>(null);
  const answersRef = useRef<Record<string, string>>({});
  const submittedRef = useRef(false);

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  // Inline quizzes are open practice, so any per-quiz time limit is not enforced there.
  const effectiveTimeLimit = embedded ? null : timeLimitSeconds;
  const timeExpired = effectiveTimeLimit !== null && secondsLeft === 0;

  function markAttemptLeft(reason: string) {
    if (!attemptId.current || submittedRef.current) return;
    setLeftPage(true);
    const body = JSON.stringify({ attemptId: attemptId.current, reason });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/quiz-attempts/leave", new Blob([body], { type: "application/json" }));
    } else {
      void fetch("/api/quiz-attempts/leave", {
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
        keepalive: true,
      });
    }
  }

  async function enterFullscreen() {
    await quizRef.current?.requestFullscreen();
  }

  async function stayInQuiz() {
    setShowExitWarning(false);
    await enterFullscreen();
  }

  function leaveQuiz() {
    setShowExitWarning(false);
    markAttemptLeft("Student confirmed leaving full-screen quiz");
  }

  useEffect(() => {
    submittedRef.current = submitted;
  }, [submitted]);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    // Inline quizzes are not monitored, so none of the anti-cheat listeners apply.
    if (embedded) return;

    function updateFullscreenState() {
      const fullscreen = Boolean(document.fullscreenElement);
      setIsFullscreen(fullscreen);
      if (!fullscreen && !submittedRef.current && attemptId.current) setShowExitWarning(true);
    }

    function warnBeforeLeaving(event: BeforeUnloadEvent) {
      if (submittedRef.current || !attemptId.current) return;
      markAttemptLeft("Student attempted to leave the quiz page");
      event.preventDefault();
      event.returnValue = "";
    }

    function handleVisibilityChange() {
      if (!document.hidden && !submittedRef.current && attemptId.current) setShowExitWarning(true);
    }

    function confirmQuizNavigation(event: MouseEvent) {
      const link = (event.target as HTMLElement).closest("a");
      if (!link || submittedRef.current || !attemptId.current) return;
      const confirmed = window.confirm("This is an unfinished quiz. Leave the page? The attempt will be flagged as ‘Left page’.");
      if (!confirmed) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        markAttemptLeft("Student confirmed navigation away from the quiz");
      }
    }

    document.addEventListener("fullscreenchange", updateFullscreenState);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("click", confirmQuizNavigation, true);
    window.addEventListener("beforeunload", warnBeforeLeaving);
    return () => {
      document.removeEventListener("fullscreenchange", updateFullscreenState);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("click", confirmQuizNavigation, true);
      window.removeEventListener("beforeunload", warnBeforeLeaving);
    };
  }, [embedded, isFullscreen]);

  useEffect(() => {
    // Inline quizzes open an attempt on submit instead, so merely browsing a
    // simulation does not leave empty "in progress" rows for administrators.
    if (embedded) return;

    let active = true;
    async function startAttempt() {
      startedAt.current = Date.now();
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const id = await insertAttempt(supabase, {
        student_id: user.id,
        quiz_id: quizId ?? null,
        simulation_slug: simulationSlug,
        total_questions: questions.length,
      });
      if (active) attemptId.current = id;
    }
    void startAttempt();
    return () => { active = false; };
  }, [embedded, quizId, questions.length, simulationSlug]);

  useEffect(() => {
    if (effectiveTimeLimit === null || submitted || leftPage) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current === null || current <= 1) {
          window.clearInterval(timer);
          setSubmitted(true);
          if (attemptId.current) {
            void fetch("/api/quiz-attempts/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ attemptId: attemptId.current, answers: answersRef.current, reason: "Time limit reached" }), keepalive: true });
          }
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [effectiveTimeLimit, leftPage, questions.length, submitted]);

  async function submitQuiz() {
    if (leftPage || answeredCount !== questions.length) return;
    setIsSubmitting(true);
    setSubmitError(null);

    // The full-screen quiz opens its attempt on mount; an inline quiz opens one here.
    let id = attemptId.current;
    if (!id) {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setSubmitError("Please sign in again to submit your answers.");
        setIsSubmitting(false);
        return;
      }
      id = await insertAttempt(supabase, {
        student_id: user.id,
        quiz_id: quizId ?? null,
        simulation_slug: simulationSlug,
        total_questions: questions.length,
      });
      attemptId.current = id;
    }
    if (!id) {
      setSubmitError("Your quiz attempt could not be started. Please try again.");
      setIsSubmitting(false);
      return;
    }

    const response = await fetch("/api/quiz-attempts/submit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ attemptId: id, answers }) });
    const result = await response.json() as { score?: number; error?: string };
    if (!response.ok || typeof result.score !== "number") {
      const message = result.error ?? "Could not submit the quiz. Please try again.";
      setSubmitError(message);
      toast.error(message);
      setIsSubmitting(false);
      return;
    }
    setServerScore(result.score);
    setSubmitted(true);
    setIsSubmitting(false);
    toast.success(
      showResultAfterSubmit
        ? `Quiz submitted! Your score: ${result.score}/${questions.length} (${Math.round((result.score / questions.length) * 100)}%)`
        : "Quiz submitted successfully! Your instructor can now view your answers."
    );
  }

  if (!currentQuestion) return null;

  const caseStudy = resolveCaseStudy(currentQuestion);

  if (submitted) {
    if (embedded) {
      return (
        <div className="pb-4">
          <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-white p-6 text-center shadow-sm">
            <p className="text-xs font-semibold tracking-[.14em] text-primary">QUIZ COMPLETE</p>
            <h3 className="mt-2 text-xl font-semibold">
              {showResultAfterSubmit ? "Your result" : "Submission received"}
            </h3>
            {showResultAfterSubmit ? (
              <>
                <p className="mt-3 text-4xl font-bold text-primary">{serverScore}/{questions.length}</p>
                <p className="mt-2 text-sm text-muted">
                  You scored {Math.round(((serverScore ?? 0) / questions.length) * 100)}% in {simulationTitle}.
                </p>
              </>
            ) : (
              <p className="mt-3 text-sm leading-6 text-muted">
                Your answers were submitted successfully. Your result is available to your instructor.
              </p>
            )}
          </div>
        </div>
      );
    }
    return <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-10"><section className="w-full max-w-lg rounded-2xl border border-border bg-white p-7 text-center shadow-sm"><p className="text-xs font-semibold tracking-[.14em] text-primary">QUIZ COMPLETE</p><h1 className="mt-3 text-3xl font-semibold">{showResultAfterSubmit ? "Your result" : "Submission received"}</h1>{showResultAfterSubmit ? <><p className="mt-4 text-5xl font-bold text-primary">{serverScore}/{questions.length}</p><p className="mt-2 text-sm text-muted">You scored {Math.round(((serverScore ?? 0) / questions.length) * 100)}% in {simulationTitle}.</p></> : <p className="mt-4 text-sm leading-6 text-muted">Your answers were submitted successfully. Your result is available to your instructor.</p>}<div className="mt-7 flex justify-center"><Link href={`/${simulationSlug}`} className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white">Back to simulation</Link></div></section></main>;
  }

  const body = (
    <>
      <div className="mx-auto max-w-[1540px]">
        <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold tracking-[.14em] text-primary">{embedded ? "GENERAL QUIZ" : "SIMULATION QUIZ"}</p><h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{simulationTitle}</h1></div>{isFullscreen && <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">Full screen active</span>}</div>
        <div className="mt-6 rounded-2xl border border-white/20 bg-[#010f0d] p-4 shadow-sm sm:p-5"><div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm font-semibold">Question {currentIndex + 1} <span className="font-normal text-muted">of {questions.length}</span></p><p className="text-xs text-muted">{answeredCount} of {questions.length} answered</p></div><div className="mt-4 flex flex-wrap gap-2" aria-label="Question navigation">{questions.map((question, index) => <button key={question.id} type="button" onClick={() => setCurrentIndex(index)} aria-label={`Go to question ${index + 1}`} className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-semibold transition ${currentIndex === index ? "bg-primary text-white" : answers[question.id] ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-muted hover:bg-primary-soft hover:text-primary"}`}>{index + 1}</button>)}</div></div>
        {effectiveTimeLimit !== null && <p className={`mt-4 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${secondsLeft !== null && secondsLeft < 30 ? "bg-red-100 text-red-700" : "bg-primary-soft text-primary"}`}>Time remaining: {Math.floor((secondsLeft ?? 0) / 60)}:{String((secondsLeft ?? 0) % 60).padStart(2, "0")}</p>}
        {leftPage && <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">This attempt was flagged because you left the quiz page. It cannot be submitted.</div>}
        {caseStudy && <section className="mt-5 rounded-2xl border border-primary/25 bg-primary-soft/40 p-5 shadow-sm sm:p-6"><p className="text-[11px] font-semibold tracking-[.14em] text-primary">PATIENT CASE</p><div className="mt-3 flex items-start gap-4">{caseStudy.patient_initials && <span aria-hidden="true" className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary text-sm font-bold text-white">{caseStudy.patient_initials}</span>}<div><h2 className="text-base font-semibold leading-6">{caseStudy.title}</h2>{caseStudy.patient_identity && <p className="mt-0.5 text-xs text-muted">{caseStudy.patient_identity}</p>}</div></div><p className="mt-4 text-sm leading-6 text-foreground">{caseStudy.scenario}</p></section>}
        <div className="mt-5 rounded-2xl border border-white/20 bg-[#010f0d] p-5 shadow-sm sm:p-7"><legend className="max-w-full px-1 text-base font-semibold leading-7 sm:text-lg"><RichTextContent html={currentQuestion.text} className="leading-7" /></legend><div className="mt-6 space-y-3">{currentQuestion.question_options.map((option) => { const selected = answers[currentQuestion.id] === option.id; const resultClass = selected ? "border-primary bg-primary-soft text-foreground" : "border-border text-muted hover:border-primary/50"; return <label key={option.id} className={`flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3.5 text-sm transition ${resultClass} ${submitted || leftPage ? "cursor-default" : ""}`}><input type="radio" name={currentQuestion.id} value={option.id} checked={selected} disabled={submitted || leftPage || timeExpired} onChange={() => setAnswers((current) => ({ ...current, [currentQuestion.id]: option.id }))} className="mt-0.5 accent-[#087f78]" /><span>{option.option_text}</span></label>; })}</div>{submitted && currentQuestion.explanation && <p className="mt-5 border-t border-border pt-4 text-xs leading-5 text-muted"><strong>Explanation:</strong> {currentQuestion.explanation}</p>}</div>
        {submitError && <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</p>}
        <div className="mt-5 flex flex-col-reverse justify-between gap-3 sm:flex-row"><button type="button" disabled={currentIndex === 0 || isSubmitting} onClick={() => setCurrentIndex((index) => index - 1)} className="rounded-xl border border-border bg-white px-5 py-3 text-sm font-semibold text-muted disabled:cursor-not-allowed disabled:opacity-40">Previous</button>{currentIndex < questions.length - 1 ? <button type="button" disabled={isSubmitting} onClick={() => setCurrentIndex((index) => index + 1)} className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">Next question</button> : <button type="button" disabled={answeredCount !== questions.length || isSubmitting || leftPage || timeExpired} onClick={() => void submitQuiz()} className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">{timeExpired ? "Time expired" : "Submit quiz"}</button>}</div>
      </div>
      {isSubmitting && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm"><div role="status" aria-live="polite" className="flex w-full max-w-xs flex-col items-center rounded-2xl bg-white p-7 text-center shadow-2xl"><span className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" /><p className="mt-4 font-semibold">Submitting your quiz...</p><p className="mt-1 text-sm text-muted">Calculating your result.</p></div></div>}
      {!embedded && !isFullscreen && !submitted && !leftPage && !showExitWarning && <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm"><div className="w-full max-w-md rounded-2xl bg-white p-7 text-center shadow-2xl"><p className="text-xs font-semibold tracking-[.14em] text-primary">FULL-SCREEN QUIZ</p><h2 className="mt-3 text-2xl font-semibold">Enter full screen to begin</h2><p className="mt-3 text-sm leading-6 text-muted">This quiz is monitored. Leaving full screen or changing tabs can flag your attempt as “Left page”.</p><button type="button" onClick={() => void enterFullscreen()} className="mt-6 w-full rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white">Enter full screen</button></div></div>}
      {!embedded && showExitWarning && !submitted && !leftPage && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm"><div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl"><p className="text-xs font-semibold tracking-[.14em] text-amber-600">QUIZ WARNING</p><h2 className="mt-3 text-2xl font-semibold">You are leaving the quiz</h2><p className="mt-3 text-sm leading-6 text-muted">Stay in full screen to continue. If you leave, this attempt will be flagged as “Left page” and cannot be submitted.</p><div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" onClick={leaveQuiz} className="rounded-xl border border-amber-200 px-4 py-3 text-sm font-semibold text-amber-700">Leave and flag attempt</button><button type="button" onClick={() => void stayInQuiz()} className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white">Return to quiz</button></div></div></div>}
    </>
  );

  if (embedded) return <div className="pb-4">{body}</div>;

  return (
    <main ref={quizRef} className="min-h-dvh bg-background px-4 py-6 text-foreground fullscreen:overflow-y-auto fullscreen:px-6 fullscreen:py-10">
      {body}
    </main>
  );
}
