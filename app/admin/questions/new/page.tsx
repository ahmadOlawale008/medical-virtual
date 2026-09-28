import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/app/admin/admin-shell";
import QuestionForm from "../question-form";
import AdminBreadcrumbs from "../../breadcrumbs";

export default async function NewQuestionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/student/questions");
  const [{ data: quizzes }, { data: caseStudies }] = await Promise.all([
    supabase.from("quizzes").select("id, title, simulation_slug").order("created_at", { ascending: false }),
    supabase.from("case_studies").select("id, title, simulation_slug").order("position", { ascending: true }),
  ]);
  return <AdminShell><AdminBreadcrumbs items={[{ label: "Questions", href: "/admin/questions" }, { label: "New question" }]} /><QuestionForm initialQuizzes={quizzes ?? []} initialCaseStudies={caseStudies ?? []} /></AdminShell>;
}
