import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/app/admin/admin-shell";
import QuestionList from "./question-list";
import { AdminQuestion } from "./question-editor";
import AdminBreadcrumbs from "../breadcrumbs";

export default async function AdminQuestionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/student/questions");

  const [{ data: questions }, { data: quizzes }] = await Promise.all([
    supabase
      .from("questions")
      .select("id, text, explanation, simulation_slug, published, question_options(id, option_text, is_correct), quiz_questions(quiz_id, quizzes(title))")
      .order("created_at", { ascending: false }),
    supabase.from("quizzes").select("id, title, simulation_slug").order("created_at", { ascending: false }),
  ]);

  return <AdminShell><div><AdminBreadcrumbs items={[{ label: "Questions" }]} /><p className="text-xs font-semibold tracking-[.14em] text-primary">ADMIN AREA</p><h1 className="mt-3 text-3xl font-semibold tracking-tight">Question bank</h1><p className="mt-2 text-sm leading-6 text-muted">Browse, assign, and manage questions by simulation.</p><QuestionList initialQuestions={(questions ?? []) as AdminQuestion[]} availableQuizzes={quizzes ?? []} /></div></AdminShell>;
}
