"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createClient } from "@/lib/supabase/client";
import { simulationCatalog } from "./simulation-catalog";
import type { AdminQuestion } from "./question-editor";
import RichTextContent from "@/app/ui/rich-text-content";
import QuestionAssignmentDialog from "./question-assignment-dialog";

type Quiz = { id: string; title: string; simulation_slug: string };

export default function QuestionList({
  initialQuestions,
  availableQuizzes,
}: {
  initialQuestions: AdminQuestion[];
  availableQuizzes: Quiz[];
}) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [filter, setFilter] = useState("");
  const router = useRouter();
  const visible = useMemo(
    () => filter ? questions.filter((question) => question.simulation_slug === filter) : questions,
    [filter, questions],
  );

  async function deleteQuestion(id: string) {
    if (!window.confirm("Delete this question?")) return;
    const { error } = await createClient().from("questions").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      setQuestions((current) => current.filter((question) => question.id !== id));
      toast.success("Question deleted.");
    }
  }

  async function deleteAll() {
    if (!window.confirm(`Delete ${filter ? "all questions for this simulation" : "all questions"}? This cannot be undone.`)) return;
    const query = createClient().from("questions").delete();
    const { error } = filter ? await query.eq("simulation_slug", filter) : await query.not("id", "is", null);
    if (error) toast.error(error.message);
    else {
      setQuestions((current) => filter ? current.filter((question) => question.simulation_slug !== filter) : []);
      toast.success("Questions deleted.");
    }
  }

  return (
    <>
      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-border bg-white p-4 shadow-sm sm:flex-row">
        <select value={filter} onChange={(event) => setFilter(event.target.value)} className="min-w-0 flex-1 rounded-xl border border-border bg-white px-3 py-3 text-sm outline-none focus:border-primary">
          <option value="">All simulations</option>
          {simulationCatalog.map((item) => <option key={item.slug} value={item.slug}>{item.title}</option>)}
        </select>
        <Link href="/admin/questions/new" className="rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-white">+ New question</Link>
        <button type="button" disabled={questions.length === 0} onClick={deleteAll} className="rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 disabled:opacity-40">Delete {filter ? "filtered" : "all"}</button>
      </div>
      <p className="mt-4 text-xs text-muted">Showing {visible.length} of {questions.length} questions</p>
      <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        {visible.length === 0 ? <div className="p-8 text-sm text-muted">No questions match this filter.</div> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-border bg-slate-50 text-xs uppercase tracking-[.08em] text-muted">
                <tr><th className="px-5 py-4">Question</th><th className="px-5 py-4">Simulation</th><th className="px-5 py-4">Assigned quizzes</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {visible.map((question) => {
                  const simulation = simulationCatalog.find((item) => item.slug === question.simulation_slug);
                  const assignments = question.quiz_questions ?? [];
                  const assigned = assignments.map((item) => Array.isArray(item.quizzes) ? item.quizzes[0]?.title : item.quizzes?.title).filter(Boolean) as string[];
                  return (
                    <tr key={question.id} tabIndex={0} onClick={() => router.push(`/admin/questions/${question.id}/edit`)} onKeyDown={(event) => { if (event.key === "Enter") router.push(`/admin/questions/${question.id}/edit`); }} className="cursor-pointer transition hover:bg-primary-soft/40">
                      <td className="max-w-[300px] px-5 py-4"><RichTextContent html={question.text} className="line-clamp-2 font-semibold leading-6" /><p className="mt-1 text-xs text-muted">{question.question_options.length} options</p></td>
                      <td className="px-5 py-4 text-xs font-semibold text-primary">{simulation?.title ?? question.simulation_slug ?? "Unassigned"}</td>
                      <td className="px-5 py-4 text-xs text-muted">
                        <div>{assigned.length ? `${assigned.slice(0, 2).join(", ")}${assigned.length > 2 ? ` +${assigned.length - 2}` : ""}` : "Not assigned"}</div>
                        <QuestionAssignmentDialog questionId={question.id} simulationSlug={question.simulation_slug} quizzes={availableQuizzes} initialQuizIds={assignments.map((item) => item.quiz_id)} onSaved={(quizIds) => setQuestions((current) => current.map((item) => item.id === question.id ? { ...item, quiz_questions: quizIds.map((quizId) => ({ quiz_id: quizId, quizzes: availableQuizzes.find((quiz) => quiz.id === quizId) ?? null })) } : item))} />
                      </td>
                      <td className="px-5 py-4"><span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${question.published ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{question.published ? "Published" : "Draft"}</span></td>
                      <td className="px-5 py-4"><div className="flex items-center gap-3"><Link href={`/admin/questions/${question.id}/preview`} onClick={(event) => event.stopPropagation()} className="text-xs font-semibold text-primary hover:underline">Preview</Link><button type="button" onClick={(event) => { event.stopPropagation(); void deleteQuestion(question.id); }} className="text-xs font-semibold text-red-600 hover:underline">Delete</button></div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
