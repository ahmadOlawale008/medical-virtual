"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { createClient } from "@/lib/supabase/client";

type Quiz = { id: string; title: string; simulation_slug: string };

type QuestionAssignmentDialogProps = {
  questionId: string;
  simulationSlug: string | null;
  quizzes: Quiz[];
  initialQuizIds: string[];
  onSaved: (quizIds: string[]) => void;
};

export default function QuestionAssignmentDialog({
  questionId,
  simulationSlug,
  quizzes,
  initialQuizIds,
  onSaved,
}: QuestionAssignmentDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedQuizIds, setSelectedQuizIds] = useState(initialQuizIds);
  const [busy, setBusy] = useState(false);
  const matchingQuizzes = quizzes.filter((quiz) => quiz.simulation_slug === simulationSlug);

  function showDialog() {
    setSelectedQuizIds(initialQuizIds);
    setOpen(true);
  }

  async function save() {
    setBusy(true);
    const supabase = createClient();
    const { error: deleteError } = await supabase.from("quiz_questions").delete().eq("question_id", questionId);
    if (deleteError) {
      toast.error(deleteError.message);
      setBusy(false);
      return;
    }

    const rows = selectedQuizIds.map((quizId, position) => ({ quiz_id: quizId, question_id: questionId, position }));
    const { error: insertError } = rows.length
      ? await supabase.from("quiz_questions").insert(rows)
      : { error: null };
    if (insertError) {
      toast.error(insertError.message);
      setBusy(false);
      return;
    }

    onSaved(selectedQuizIds);
    setOpen(false);
    setBusy(false);
    toast.success("Question assignments updated.");
  }

  return (
    <>
      <button
        type="button"
        onClick={(event) => { event.stopPropagation(); showDialog(); }}
        className="text-xs font-semibold text-primary hover:underline"
      >
        Assign quizzes
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" role="presentation" onClick={() => setOpen(false)}>
          <div role="dialog" aria-modal="true" aria-labelledby={`assign-question-${questionId}`} className="w-full max-w-lg rounded-2xl border border-border bg-white p-6 shadow-xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-[.14em] text-primary">QUESTION ASSIGNMENT</p>
                <h2 id={`assign-question-${questionId}`} className="mt-2 text-xl font-semibold">Assign to quizzes</h2>
                <p className="mt-2 text-sm leading-6 text-muted">Select one or more quizzes for this question. Only quizzes using the same simulation are shown.</p>
              </div>
              <button type="button" aria-label="Close assignment dialog" onClick={() => setOpen(false)} className="text-2xl leading-none text-muted hover:text-foreground">&times;</button>
            </div>
            {matchingQuizzes.length === 0 ? (
              <p className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-muted">No quizzes exist for this simulation yet.</p>
            ) : (
              <div className="mt-5 max-h-72 space-y-2 overflow-y-auto">
                {matchingQuizzes.map((quiz) => (
                  <label key={quiz.id} className="flex min-h-11 items-center gap-3 rounded-xl border border-border px-3 py-2.5 text-sm hover:bg-primary-soft/30">
                    <input
                      type="checkbox"
                      checked={selectedQuizIds.includes(quiz.id)}
                      onChange={(event) => setSelectedQuizIds((current) => event.target.checked ? [...current, quiz.id] : current.filter((id) => id !== quiz.id))}
                    />
                    <span>{quiz.title}</span>
                  </label>
                ))}
              </div>
            )}
            <div className="mt-6 flex justify-end gap-3 border-t border-border pt-4">
              <button type="button" onClick={() => setOpen(false)} className="rounded-xl border border-border px-4 py-3 text-sm font-semibold text-muted">Cancel</button>
              <button type="button" onClick={() => void save()} disabled={busy || matchingQuizzes.length === 0} className="rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">{busy ? "Saving..." : "Save assignments"}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
