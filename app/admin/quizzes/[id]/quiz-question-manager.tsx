"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { createClient } from "@/lib/supabase/client";
import RichTextContent from "@/app/ui/rich-text-content";

type Question = { id: string; text: string; published: boolean; simulation_slug: string | null };

export default function QuizQuestionManager({ quizId, questions, initialAttached }: { quizId: string; questions: Question[]; initialAttached: string[] }) {
  const [selected, setSelected] = useState(new Set(initialAttached));
  const [busy, setBusy] = useState(false);
  async function save() {
    setBusy(true);
    const supabase = createClient();
    const { error: deleteError } = await supabase.from("quiz_questions").delete().eq("quiz_id", quizId);
    if (deleteError) { toast.error(deleteError.message); setBusy(false); return; }
    const rows = Array.from(selected).map((questionId, position) => ({ quiz_id: quizId, question_id: questionId, position }));
    const { error } = rows.length ? await supabase.from("quiz_questions").insert(rows) : { error: null };
    if (error) toast.error(error.message); else toast.success("Quiz questions updated.");
    setBusy(false);
  }
  return <div className="mt-6 rounded-2xl border border-border bg-white p-5 shadow-sm"><p className="mb-4 text-sm text-muted">Questions are assigned here by quiz. You can also assign one question to multiple quizzes from the question bank.</p><div className="space-y-3">{questions.length === 0 && <p className="text-sm text-muted">No questions exist yet. Create them in the question bank first.</p>}{questions.map((question, index) => <label key={question.id} className="flex cursor-pointer gap-3 rounded-xl border border-border p-4 hover:bg-primary-soft/30"><input type="checkbox" checked={selected.has(question.id)} onChange={() => setSelected((current) => { const next = new Set(current); if (next.has(question.id)) next.delete(question.id); else next.add(question.id); return next; })} className="mt-1" /><span className="min-w-0 flex-1"><span className="text-xs font-semibold text-muted">Question {index + 1}</span><RichTextContent html={question.text} className="mt-1 text-sm font-semibold leading-6" /><span className="mt-2 block text-xs text-muted">{question.published ? "Published question" : "Draft question"} · {question.simulation_slug ?? "No simulation"}</span></span></label>)}</div><div className="mt-5 flex items-center justify-between border-t border-border pt-4"><p className="text-sm text-muted">{selected.size} question{selected.size === 1 ? "" : "s"} selected</p><button type="button" onClick={() => void save()} disabled={busy} className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{busy ? "Saving…" : "Save quiz questions"}</button></div></div>;
}
