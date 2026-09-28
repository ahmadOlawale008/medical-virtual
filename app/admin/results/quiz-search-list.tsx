"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import { simulationCatalog } from "../questions/simulation-catalog";

type Quiz = { id: string; title: string; simulation_slug: string };

export default function QuizSearchList({ quizzes }: { quizzes: Quiz[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [simulationFilter, setSimulationFilter] = useState("all");

  const simulations = useMemo(() => {
    const map = new Map<string, string>();
    for (const q of quizzes) {
      if (!map.has(q.simulation_slug)) {
        const cat = simulationCatalog.find((item) => item.slug === q.simulation_slug);
        map.set(q.simulation_slug, cat?.title ?? q.simulation_slug);
      }
    }
    return Array.from(map.entries()).map(([slug, title]) => ({ slug, title }));
  }, [quizzes]);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return quizzes.filter((quiz) => {
      if (simulationFilter !== "all" && quiz.simulation_slug !== simulationFilter) return false;
      if (!term) return true;
      const simTitle = simulationCatalog.find((item) => item.slug === quiz.simulation_slug)?.title ?? "";
      return quiz.title.toLowerCase().includes(term) || simTitle.toLowerCase().includes(term);
    });
  }, [quizzes, searchTerm, simulationFilter]);

  if (!quizzes.length) {
    return (
      <div className="mt-6 rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
        <p className="text-sm text-muted">No quizzes have been created yet.</p>
        <Link
          href="/admin/quizzes/new"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-white shadow-sm"
        >
          Create first quiz
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {/* Search and simulation filter bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search quizzes by title or simulation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-border bg-slate-50/60 py-2.5 pl-9 pr-3 text-xs text-foreground placeholder:text-muted focus:border-primary focus:bg-white focus:outline-none"
          />
        </div>

        {simulations.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted">Simulation:</span>
            <select
              aria-label="Filter quizzes by simulation"
              value={simulationFilter}
              onChange={(e) => setSimulationFilter(e.target.value)}
              className="rounded-xl border border-border bg-slate-50/60 px-3 py-2 text-xs font-medium text-foreground focus:border-primary focus:bg-white focus:outline-none"
            >
              <option value="all">All simulations ({quizzes.length})</option>
              {simulations.map((sim) => (
                <option key={sim.slug} value={sim.slug}>
                  {sim.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Quiz Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-white p-8 text-center">
          <p className="text-sm font-medium text-foreground">No quizzes match your search</p>
          <p className="mt-1 text-xs text-muted">Try clearing the search query or changing the filter.</p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setSimulationFilter("all");
            }}
            className="mt-3 text-xs font-semibold text-primary hover:underline"
          >
            Reset search
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((quiz) => {
            const simName =
              simulationCatalog.find((item) => item.slug === quiz.simulation_slug)?.title ??
              quiz.simulation_slug;

            return (
              <Link
                key={quiz.id}
                href={`/admin/results?quiz=${quiz.id}`}
                className="group flex flex-col justify-between rounded-2xl border border-border bg-white p-5 shadow-sm transition hover:border-primary hover:shadow-md"
              >
                <div>
                  <span className="inline-block rounded-md bg-primary-soft/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                    {simName}
                  </span>
                  <h3 className="mt-2.5 text-base font-semibold text-foreground group-hover:text-primary transition">
                    {quiz.title}
                  </h3>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-border pt-3 text-xs font-semibold text-primary">
                  <span>View student results</span>
                  <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
