import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null) as { attemptId?: string; reason?: string } | null;
  if (!body?.attemptId) return Response.json({ error: "Attempt id is required" }, { status: 400 });

  const { error } = await supabase
    .from("quiz_attempts")
    .update({
      status: "left_page",
      exit_reason: body.reason ?? "Student left the quiz page",
      left_at: new Date().toISOString(),
    })
    .eq("id", body.attemptId)
    .eq("student_id", user.id)
    .eq("status", "in_progress");

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}
