import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const resultUrl = new URL("/auth/verify-email/result", request.url);

  if (!code) {
    resultUrl.searchParams.set("status", "missing-code");
    return NextResponse.redirect(resultUrl);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  resultUrl.searchParams.set("status", error ? "error" : "success");
  return NextResponse.redirect(resultUrl);
}
