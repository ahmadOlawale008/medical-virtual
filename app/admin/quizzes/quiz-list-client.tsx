"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { createClient } from "@/lib/supabase/client";
import { simulationCatalog } from "../questions/simulation-catalog";
import { Search, Plus, Clock, HelpCircle, BarChart3, Edit3, Trash2, ExternalLink, Calendar, Layers } from "lucide-react";

export type AdminQuizItem = {
  id: string;
  title: string;
  simulation_slug: string;
  description: string | null;
  published: boolean;
  time_limit_seconds: number | null;
  one_time_use: boolean;
  show_result_after_submit: boolean;
  created_at: string;
  question_count?: number;
  preset_name?: string | null;
};

export default function QuizListClient({ initialQuizzes }: { initialQuizzes: AdminQuizItem[] }) {
  const [quizzes, setQuizzes] = useState(initialQuizzes);
  const [searchTerm, setSearchTerm] = useState("");
  const [simulationFilter, setSimulationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const simulations = useMemo(() => {
    const slugs = Array.from(new Set(quizzes.map((q) => q.simulation_slug)));
    return slugs.map((slug) => ({
      slug,
      title: simulationCatalog.find((item) => item.slug === slug)?.title ?? slug,
    }));
  }, [quizzes]);

  const filtered = useMemo(() => {
    return quizzes.filter((quiz) => {
      if (simulationFilter !== "all" && quiz.simulation_slug !== simulationFilter) return false;
      if (statusFilter === "published" && !quiz.published) return false;
      if (statusFilter === "draft" && quiz.published) return false;
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      const simTitle = simulationCatalog.find((item) => item.slug === quiz.simulation_slug)?.title ?? quiz.simulation_slug;
      return quiz.title.toLowerCase().includes(term) || simTitle.toLowerCase().includes(term);
    });
  }, [quizzes, searchTerm, simulationFilter, statusFilter]);

  async function handleDelete(quiz: AdminQuizItem) {
    if (!window.confirm("Are you sure you want to delete " + quiz.title + "?")) return;
    setDeletingId(quiz.id);
    const supabase = createClient();
    const { error } = await supabase.from("quizzes").delete().eq("id", quiz.id);
    if (error) {
      toast.error(error.message);
      setDeletingId(null);
    } else {
      setQuizzes((prev) => prev.filter((q) => q.id !== quiz.id));
      toast.success("Quiz deleted.");
      setDeletingId(null);
    }
  }

  async function togglePublish(quiz: AdminQuizItem) {
    const nextPublished = !quiz.published;
    const supabase = createClient();
    const { error } = await supabase.from("quizzes").update({ published: nextPublished }).eq("id", quiz.id);
    if (error) {
      toast.error(error.message);
    } else {
      setQuizzes((prev) => prev.map((q) => (q.id === quiz.id ? { ...q, published: nextPublished } : q)));
      toast.success(nextPublished ? "Quiz published." : "Quiz unpublished.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search quizzes by title or simulation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-border bg-white pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-primary shadow-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={simulationFilter}
            onChange={(e) => setSimulationFilter(e.target.value)}
            aria-label="Filter by simulation"
            className="rounded-xl border border-border bg-white px-3 py-2.5 text-xs font-medium text-foreground focus:border-primary focus:outline-none shadow-sm"
          >
            <option value="all">All simulations ({quizzes.length})</option>
            {simulations.map((sim) => (
              <option key={sim.slug} value={sim.slug}>{sim.title}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | "published" | "draft")}
            aria-label="Filter by status"
            className="rounded-xl border border-border bg-white px-3 py-2.5 text-xs font-medium text-foreground focus:border-primary focus:outline-none shadow-sm"
          >
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          <Link
            href="/admin/quizzes/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-primary-dark"
          >
            <Plus className="size-4" />
            <span>New quiz</span>
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-muted">
        <span>Showing {filtered.length} of {quizzes.length} quizzes</span>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-white p-12 text-center shadow-sm">
          <Layers className="mx-auto size-10 text-muted/40 mb-3" />
          <h3 className="text-base font-semibold text-foreground">No quizzes found</h3>
          <p className="mt-1 text-xs text-muted max-w-sm mx-auto">
            {quizzes.length === 0
              ? "You have not created any custom quizzes yet."
              : "No quizzes match your current filters."}
          </p>
          {quizzes.length === 0 && (
            <Link
              href="/admin/quizzes/new"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-primary-dark transition"
            >
              <Plus className="size-3.5" />
              Create your first quiz
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((quiz) => {
            const sim = simulationCatalog.find((item) => item.slug === quiz.simulation_slug);
            const questionCount = quiz.question_count ?? 0;
            const isDeleting = deletingId === quiz.id;

            return (
              <div
                key={quiz.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-border bg-white p-5 shadow-sm transition hover:border-primary/60 hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="rounded-md bg-primary-soft/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                      {sim?.title ?? quiz.simulation_slug}
                    </span>
                    <button
                      type="button"
                      onClick={() => togglePublish(quiz)}
                      title="Click to toggle publish status"
                      className={"rounded-full px-2 py-0.5 text-[10px] font-semibold transition " + (quiz.published ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-slate-100 text-slate-600 hover:bg-slate-200")}
                    >
                      {quiz.published ? "Published" : "Draft"}
                    </button>
                  </div>

                  <h3 className="mt-3 text-base font-semibold tracking-tight text-foreground line-clamp-1 group-hover:text-primary transition">
                    <Link href={"/admin/quizzes/" + quiz.id}>{quiz.title}</Link>
                  </h3>

                  {quiz.description && (
                    <p className="mt-1 text-xs text-muted line-clamp-2">{quiz.description}</p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-muted">
                    <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-1 font-medium border border-border/50">
                      <HelpCircle className="size-3 text-primary" />
                      {questionCount} {questionCount === 1 ? "question" : "questions"}
                    </span>

                    {quiz.time_limit_seconds ? (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-1 font-medium border border-border/50">
                        <Clock className="size-3 text-amber-600" />
                        {Math.floor(quiz.time_limit_seconds / 60)} mins
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-1 font-medium border border-border/50">
                        <Clock className="size-3 text-slate-400" />
                        No limit
                      </span>
                    )}

                    {quiz.preset_name && (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-1 font-medium border border-border/50">
                        <Calendar className="size-3 text-indigo-500" />
                        {quiz.preset_name}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-border pt-3.5">
                  <div className="flex items-center gap-1">
                    <Link
                      href={"/admin/quizzes/" + quiz.id}
                      className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-primary hover:bg-primary-soft transition"
                    >
                      <Edit3 className="size-3.5" />
                      Manage
                    </Link>
                    <Link
                      href={"/admin/results?quiz=" + quiz.id}
                      className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-muted hover:text-foreground hover:bg-slate-100 transition"
                    >
                      <BarChart3 className="size-3.5" />
                      Results
                    </Link>
                  </div>

                  <div className="flex items-center gap-1">
                    <Link
                      href={"/" + quiz.simulation_slug}
                      target="_blank"
                      title="Open simulation"
                      className="p-1.5 text-muted hover:text-foreground transition rounded-md hover:bg-slate-100"
                    >
                      <ExternalLink className="size-3.5" />
                    </Link>
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() => handleDelete(quiz)}
                      title="Delete quiz"
                      className="p-1.5 text-muted hover:text-red-600 transition rounded-md hover:bg-red-50 disabled:opacity-40"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
