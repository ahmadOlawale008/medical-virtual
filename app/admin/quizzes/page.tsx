import { redirect } from "next/navigation";
import AdminShell from "@/app/admin/admin-shell";
import AdminBreadcrumbs from "../breadcrumbs";
import { createClient } from "@/lib/supabase/server";
import QuizListClient, { type AdminQuizItem } from "./quiz-list-client";

export default async function AdminQuizzesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/student/questions");

  const { data: quizzes } = await supabase
    .from("quizzes")
    .select(`
      id,
      title,
      simulation_slug,
      description,
      published,
      time_limit_seconds,
      one_time_use,
      show_result_after_submit,
      created_at,
      availability_presets (
        name
      ),
      quiz_questions (
        count
      )
    `)
    .order("created_at", { ascending: false });

  const formattedQuizzes: AdminQuizItem[] = (quizzes ?? []).map((q: any) => ({
    id: q.id,
    title: q.title,
    simulation_slug: q.simulation_slug,
    description: q.description,
    published: q.published,
    time_limit_seconds: q.time_limit_seconds,
    one_time_use: q.one_time_use,
    show_result_after_submit: q.show_result_after_submit,
    created_at: q.created_at,
    question_count: q.quiz_questions?.[0]?.count ?? 0,
    preset_name: q.availability_presets?.name ?? null,
  }));

  return (
    <AdminShell>
      <div>
        <AdminBreadcrumbs items={[{ label: "Quizzes" }]} />
        <div className="mb-6 mt-4">
          <p className="text-xs font-semibold tracking-[.14em] text-primary uppercase">QUIZ ADMINISTRATION</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">Quizzes</h1>
          <p className="mt-1 text-sm text-muted">
            Create, configure, and manage quizzes and assign questions across simulations.
          </p>
        </div>

        <QuizListClient initialQuizzes={formattedQuizzes} />
      </div>
    </AdminShell>
  );
}
