import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/app/admin/admin-shell";
import SettingsForm from "./settings-form";

export default async function QuizSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/student/questions");
  const { data: settings } = await supabase.from("simulation_quiz_settings").select("simulation_slug, time_limit_seconds");
  return <AdminShell><div><p className="text-xs font-semibold tracking-[.14em] text-primary">QUIZ SETTINGS</p><h1 className="mt-3 text-3xl font-semibold tracking-tight">Time limits</h1><p className="mt-2 text-sm leading-6 text-muted">Configure timing separately for each simulation.</p><div className="mt-6"><SettingsForm initialSettings={settings ?? []} /></div></div></AdminShell>;
}
