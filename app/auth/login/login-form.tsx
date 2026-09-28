"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "react-toastify";

export default function LoginForm() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const data = new FormData(event.currentTarget);
    const { error: signInError } = await createClient().auth.signInWithPassword({ email: String(data.get("email")), password: String(data.get("password")) });
    if (signInError) {
      toast(signInError.message, {type: "error"})
      setError(signInError.message);
    } else {
      toast("Successfully logged in!", {type: "success"})
      const next = new URLSearchParams(window.location.search).get("next");
      router.push(next?.startsWith("/") ? next : "/student/questions");
    }
    setBusy(false);
  }
  return <form onSubmit={submit} className="mt-7 space-y-4">
    <label className="block text-sm font-medium">Email<input required name="email" type="email" autoComplete="email" className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-white outline-none focus:border-[#48d2b2]" />
    </label>
    <label className="block text-sm font-medium">
      Password
      <span className="relative mt-2 block">
        <input required name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 pr-11 text-white outline-none focus:border-[#48d2b2]" />
        <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/45 transition hover:text-white">
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </span>
    </label>
    {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
    <button disabled={busy} className="w-full rounded-xl bg-[#19a878] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">{busy ? "Signing in…" : "Sign in"}
    </button></form>;
}
