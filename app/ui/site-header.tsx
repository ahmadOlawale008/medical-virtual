import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./logout-button";

function BrandMark() {
  return (
    <span aria-hidden="true" className="grid size-9 place-items-center rounded-md bg-primary text-white">
      <svg className="size-5 fill-none stroke-current stroke-[1.8]" viewBox="0 0 32 32">
        <path d="M16 5v22M5 16h22" />
        <path d="M9 9c4.5 2 9.5 2 14 0M9 23c4.5-2 9.5-2 14 0" />
      </svg>
    </span>
  );
}

export default async function SiteHeader() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let role: "student" | "admin" | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    role = profile?.role === "admin" ? "admin" : "student";
  }

  return (
    <header className="border-b border-border bg-white">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-5 px-4">
        <Link className="flex items-center gap-3" href="/" aria-label="MedLab Virtual home">
          <BrandMark />
          <span className="font-accent text-base font-bold tracking-tight">MedLab Virtual</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-muted sm:flex" aria-label="Main navigation">
          <Link className="transition hover:text-primary" href="/#disciplines">Disciplines</Link>
          <Link className="transition hover:text-primary" href="/#how-it-works">How it works</Link>
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {role === "admin" ? (
                <Link href="/admin/questions" className="rounded-md border border-primary/20 px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary-soft">
                  Admin
                </Link>
              ) : (
                <span className="text-sm font-semibold text-muted">Student</span>
              )}
              <LogoutButton />
            </>
          ) : (
            <Link href="/auth/login" className="text-sm font-semibold text-primary transition hover:text-[#066a64]">Sign in</Link>
          )}
          {!user && (
            <Link href="/auth/signup" className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#066a64]">Create account</Link>
          )}
        </div>
      </div>
    </header>
  );
}
