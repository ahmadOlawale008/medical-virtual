import { createClient } from "@/lib/supabase/server";

type SubmitBody = {
  attemptId?: string;
  answers?: Record<string, string>;
  reason?: string;
};

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null) as SubmitBody | null;
  if (!body?.attemptId || !body.answers) {
    return Response.json({ error: "Attempt id and answers are required" }, { status: 400 });
  }

  const { data: attempt, error: attemptError } = await supabase
    .from("quiz_attempts")
    .select("id, total_questions, status, student_id, started_at, quiz_id")
    .eq("id", body.attemptId)
    .eq("student_id", user.id)
    .single();

  if (attemptError || !attempt || attempt.status !== "in_progress") {
    return Response.json({ error: "This quiz attempt is no longer active" }, { status: 409 });
  }

  const answers = Object.entries(body.answers);
  if (answers.length !== attempt.total_questions) {
    return Response.json({ error: "Answer every question before submitting" }, { status: 400 });
  }
  if (attempt.quiz_id) {
    const { data: quizQuestions } = await supabase.from("quiz_questions").select("question_id").eq("quiz_id", attempt.quiz_id);
    const allowedQuestions = new Set((quizQuestions ?? []).map((item) => item.question_id));
    if (answers.some(([questionId]) => !allowedQuestions.has(questionId))) {
      return Response.json({ error: "Invalid question submitted" }, { status: 400 });
    }
  }
  const optionIds = answers.map(([, optionId]) => optionId);
  const { data: options, error: optionsError } = await supabase
    .from("question_options")
    .select("id, question_id, is_correct")
    .in("id", optionIds.length ? optionIds : ["00000000-0000-0000-0000-000000000000"]);

  if (optionsError) return Response.json({ error: optionsError.message }, { status: 500 });

  const correctByQuestion = new Map(
    (options ?? []).filter((option) => option.is_correct).map((option) => [option.question_id, option.id]),
  );
  const score = answers.reduce(
    (total, [questionId, optionId]) => total + (correctByQuestion.get(questionId) === optionId ? 1 : 0),
    0,
  );
  const knownOptionIds = new Set((options ?? []).map((option) => option.id));
  const answerRows = answers.map(([questionId, optionId]) => ({
    attempt_id: attempt.id,
    student_id: user.id,
    question_id: questionId,
    selected_option_id: knownOptionIds.has(optionId) ? optionId : null,
    is_correct: correctByQuestion.get(questionId) === optionId,
  }));

  // Record per-question responses before completing the attempt so admins can
  // review question-level results. Upsert keeps a retried submission idempotent.
  const { error: answersError } = await supabase
    .from("quiz_attempt_answers")
    .upsert(answerRows, { onConflict: "attempt_id,question_id" });
  if (answersError) return Response.json({ error: answersError.message }, { status: 500 });

  const submittedAt = new Date().toISOString();
  const { error: updateError } = await supabase
    .from("quiz_attempts")
    .update({
      status: "completed",
      score,
      submitted_at: submittedAt,
      duration_seconds: Math.max(0, Math.round((Date.now() - new Date(attempt.started_at).getTime()) / 1000)),
      exit_reason: body.reason ?? null,
    })
    .eq("id", attempt.id)
    .eq("student_id", user.id)
    .eq("status", "in_progress");

  if (updateError) return Response.json({ error: updateError.message }, { status: 500 });
  return Response.json({ score, totalQuestions: attempt.total_questions });
}
