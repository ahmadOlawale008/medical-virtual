"use client";

import { useMemo, useState } from "react";
import { Search, Users, Award, AlertTriangle, Clock, ArrowUpDown, Filter } from "lucide-react";
import type { QuizAttemptRow } from "./types";

export default function AttemptsTable({
  attempts,
  totalQuizQuestions,
}: {
  attempts: QuizAttemptRow[];
  totalQuizQuestions: number;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "left_page" | "in_progress">("all");
  const [sortBy, setSortBy] = useState<"started_desc" | "started_asc" | "score_desc" | "score_asc">("started_desc");

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return attempts
      .filter((attempt) => {
        if (statusFilter !== "all" && attempt.status !== statusFilter) return false;
        if (!term) return true;
        const profile = Array.isArray(attempt.profiles) ? attempt.profiles[0] : attempt.profiles;
        const name = (profile?.full_name ?? "unnamed student").toLowerCase();
        return name.includes(term);
      })
      .sort((a, b) => {
        if (sortBy === "started_desc") return new Date(b.started_at).getTime() - new Date(a.started_at).getTime();
        if (sortBy === "started_asc") return new Date(a.started_at).getTime() - new Date(b.started_at).getTime();
        if (sortBy === "score_desc") return (b.score ?? 0) - (a.score ?? 0);
        if (sortBy === "score_asc") return (a.score ?? 0) - (b.score ?? 0);
        return 0;
      });
  }, [attempts, searchTerm, statusFilter, sortBy]);

  const completedAttempts = attempts.filter((a) => a.status === "completed");
  const flaggedAttempts = attempts.filter((a) => a.status === "left_page");
  const averageScore = completedAttempts.length
    ? Math.round(
        completedAttempts.reduce(
          (sum, a) => sum + (a.score / (a.total_questions || totalQuizQuestions || 1)) * 100,
          0
        ) / completedAttempts.length
      )
    : null;

  return (
    <div className="space-y-6">
      {/* Metric KPI cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
            <Users className="size-3.5 text-primary" />
            <span>Total Attempts</span>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">{attempts.length}</p>
          <p className="mt-0.5 text-xs text-muted">All student sessions</p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
            <Award className="size-3.5 text-emerald-600" />
            <span>Completed</span>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-emerald-600">{completedAttempts.length}</p>
          <p className="mt-0.5 text-xs text-muted">
            {attempts.length ? Math.round((completedAttempts.length / attempts.length) * 100) : 0}% completion
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
            <Award className="size-3.5 text-primary" />
            <span>Avg Score</span>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-primary">
            {averageScore !== null ? `${averageScore}%` : "—"}
          </p>
          <p className="mt-0.5 text-xs text-muted">Completed attempts</p>
        </div>

        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
            <AlertTriangle className="size-3.5 text-amber-600" />
            <span>Left Page</span>
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-amber-600">{flaggedAttempts.length}</p>
          <p className="mt-0.5 text-xs text-muted">Flagged attempts</p>
        </div>
      </div>

      {/* Main attempts table card */}
      <section className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 border-b border-border pb-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground">Student Submissions</h2>
            <p className="text-xs text-muted">Showing {filtered.length} of {attempts.length} attempts</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative min-w-[200px] flex-1 sm:w-60 sm:flex-initial">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Search student..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-border bg-slate-50/60 py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-muted focus:border-primary focus:bg-white focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 rounded-xl border border-border bg-slate-50/60 px-2.5 py-1.5 text-xs">
              <Filter className="size-3.5 text-muted" />
              <select
                aria-label="Filter status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className="bg-transparent text-xs font-medium text-foreground focus:outline-none"
              >
                <option value="all">All statuses</option>
                <option value="completed">Completed</option>
                <option value="left_page">Left page</option>
                <option value="in_progress">In progress</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 rounded-xl border border-border bg-slate-50/60 px-2.5 py-1.5 text-xs">
              <ArrowUpDown className="size-3.5 text-muted" />
              <select
                aria-label="Sort attempts"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-transparent text-xs font-medium text-foreground focus:outline-none"
              >
                <option value="started_desc">Newest first</option>
                <option value="started_asc">Oldest first</option>
                <option value="score_desc">Highest score</option>
                <option value="score_asc">Lowest score</option>
              </select>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm font-medium text-foreground">No matching submissions found</p>
            <p className="mt-1 text-xs text-muted">
              {attempts.length === 0 ? "No students have attempted this quiz yet." : "Try adjusting your search or filters."}
            </p>
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-border text-xs font-semibold uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-3.5 py-3">Student</th>
                  <th className="px-3.5 py-3">Status</th>
                  <th className="px-3.5 py-3">Score</th>
                  <th className="px-3.5 py-3">Accuracy</th>
                  <th className="px-3.5 py-3">Started</th>
                  <th className="px-3.5 py-3">Submitted</th>
                  <th className="px-3.5 py-3">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((attempt) => {
                  const profile = Array.isArray(attempt.profiles) ? attempt.profiles[0] : attempt.profiles;
                  const name = profile?.full_name?.trim() || "Unnamed Student";
                  const total = attempt.total_questions || totalQuizQuestions || 1;
                  const pct = attempt.status === "completed" ? Math.round((attempt.score / total) * 100) : null;
                  const initials = name.split(" ").map((p) => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();

                  return (
                    <tr key={attempt.id} className="transition hover:bg-slate-50/70">
                      <td className="px-3.5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-full bg-primary-soft text-[11px] font-bold text-primary">
                            {initials}
                          </span>
                          <span className="font-medium text-foreground">{name}</span>
                        </div>
                      </td>
                      <td className="px-3.5 py-3.5">
                        {attempt.status === "completed" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                            <span className="size-1.5 rounded-full bg-emerald-500" />
                            Completed
                          </span>
                        ) : attempt.status === "left_page" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                            <AlertTriangle className="size-3" />
                            Left page
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                            In progress
                          </span>
                        )}
                      </td>
                      <td className="px-3.5 py-3.5">
                        {attempt.status === "completed" ? (
                          <span className="font-bold text-foreground">
                            {attempt.score} <span className="font-normal text-muted">/ {total}</span>
                          </span>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td className="px-3.5 py-3.5">
                        {pct !== null ? (
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-14 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className={`h-full ${pct >= 70 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className={`text-xs font-semibold ${pct >= 70 ? "text-emerald-700" : pct >= 50 ? "text-amber-700" : "text-red-700"}`}>
                              {pct}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted">—</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3.5 py-3.5 text-xs text-muted">
                        {new Date(attempt.started_at).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="whitespace-nowrap px-3.5 py-3.5 text-xs text-muted">
                        {attempt.submitted_at
                          ? new Date(attempt.submitted_at).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
                          : attempt.left_at
                          ? `Left at ${new Date(attempt.left_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                          : "—"}
                      </td>
                      <td className="whitespace-nowrap px-3.5 py-3.5 text-xs text-muted">
                        {attempt.duration_seconds !== null ? (
                          <span className="inline-flex items-center gap-1">
                            <Clock className="size-3 text-muted" />
                            {Math.floor(attempt.duration_seconds / 60)}m {attempt.duration_seconds % 60}s
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
