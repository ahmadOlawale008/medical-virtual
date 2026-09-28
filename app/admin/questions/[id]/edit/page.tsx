import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/app/admin/admin-shell";
import QuestionForm from "../../question-form";
import type { AdminQuestion } from "../../question-editor";
import AdminBreadcrumbs from "../../../breadcrumbs";

export default async function EditQuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/student/questions");
  const { data: question } = await supabase.from("questions").select("id, text, explanation, simulation_slug, case_study_id, published, question_options(id, option_text, is_correct), quiz_questions(quiz_id)").eq("id", id).single();
  if (!question) notFound();
  const [{ data: quizzes }, { data: caseStudies }] = await Promise.all([
    supabase.from("quizzes").select("id, title, simulation_slug").order("created_at", { ascending: false }),
    supabase.from("case_studies").select("id, title, simulation_slug").order("position", { ascending: true }),
  ]);
  return <AdminShell>
      <AdminBreadcrumbs items={[{ label: "Questions", href: "/admin/questions" }, ...(question.simulation_slug ? [{ label: "Simulation", href: `/${question.simulation_slug}` }] : []), { label: "Edit question" }]} />
      <div className="mb-5 flex justify-end"><a href={`/admin/questions/${id}/preview`} className="rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold text-primary shadow-sm hover:bg-primary-soft">Preview question</a></div>
      <QuestionForm question={question as AdminQuestion} initialQuizzes={quizzes ?? []} initialCaseStudies={caseStudies ?? []} />
    </AdminShell>;
}
