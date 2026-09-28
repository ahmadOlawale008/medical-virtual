import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/app/admin/admin-shell";
import AdminBreadcrumbs from "../../breadcrumbs";
import QuizForm from "../quiz-form";

export default async function NewQuizPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/student/questions");
  const { data: presets } = await supabase.from("availability_presets").select("id, name, availability_type, available_from, available_until").order("name");
  return <AdminShell><AdminBreadcrumbs items={[{ label: "Quizzes", href: "/admin/quizzes" }, { label: "New quiz" }]} /><QuizForm presets={presets ?? []} /></AdminShell>;
}
