import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function StudentQuestionsPage() {
  const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");
  return <main className="min-h-dvh bg-background px-4 py-10 text-foreground"><div className="mx-auto max-w-4xl"><p className="text-xs font-semibold tracking-[.14em] text-primary">STUDENT AREA</p><h1 className="mt-3 text-3xl font-semibold">Questions</h1><p className="mt-2 text-sm text-muted">Your question sets will appear here once an administrator publishes them.</p><div className="mt-8 rounded-xl border border-border bg-white p-6 text-sm text-muted">Signed in as {user.email}</div></div></main>;
}
