import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/app/admin/admin-shell";
import AdminBreadcrumbs from "../../breadcrumbs";
import QuizQuestionManager from "./quiz-question-manager";
import QuizConfigurationForm from "./quiz-configuration-form";

export default async function ManageQuizPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ tab?: string }> }) {
  const { id } = await params;
  const { tab } = await searchParams;
  const activeTab = tab === "config" ? "config" : "questions";
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/student/questions");
  const { data: quiz } = await supabase.from("quizzes").select("id, title, description, simulation_slug, published, time_limit_seconds, availability_preset_id, one_time_use, show_result_after_submit").eq("id", id).single();
  if (!quiz) notFound();
  const [{ data: questions }, { data: attached }, { data: presets }] = await Promise.all([
    activeTab === "questions" ? supabase.from("questions").select("id, text, published, simulation_slug").order("created_at", { ascending: true }) : Promise.resolve({ data: null }),
    activeTab === "questions" ? supabase.from("quiz_questions").select("question_id").eq("quiz_id", id) : Promise.resolve({ data: null }),
    supabase.from("availability_presets").select("id, name, availability_type, available_from, available_until").order("name"),
  ]);
  return <AdminShell><AdminBreadcrumbs items={[{ label: "Quizzes", href: "/admin/quizzes" }, { label: quiz.title }]} /><div><p className="text-xs font-semibold tracking-[.14em] text-primary">QUIZ MANAGEMENT</p><h1 className="mt-3 text-3xl font-semibold tracking-tight">{quiz.title}</h1><p className="mt-2 text-sm leading-6 text-muted">Manage this quiz&apos;s questions and configuration.</p><nav className="mt-6 flex gap-1 border-b border-border" aria-label="Quiz sections"><Link href={`/admin/quizzes/${id}`} className={`border-b-2 px-4 py-3 text-sm font-semibold ${activeTab === "questions" ? "border-primary text-primary" : "border-transparent text-muted hover:text-foreground"}`}>Quiz questions</Link><Link href={`/admin/quizzes/${id}?tab=config`} className={`border-b-2 px-4 py-3 text-sm font-semibold ${activeTab === "config" ? "border-primary text-primary" : "border-transparent text-muted hover:text-foreground"}`}>Configuration</Link></nav>{activeTab === "config" ? <QuizConfigurationForm quiz={quiz} presets={presets ?? []} /> : <QuizQuestionManager quizId={quiz.id} questions={questions ?? []} initialAttached={(attached ?? []).map((item) => item.question_id)} />}</div></AdminShell>;
}
