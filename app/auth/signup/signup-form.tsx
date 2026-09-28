"use client";

import { FormEvent, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "react-toastify";


export default function SignupForm() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");

    const data = new FormData(event.currentTarget);
    const { error: signUpError } = await createClient().auth.signUp({
      email: String(data.get("email")),
      password: String(data.get("password")),
      options: {
        data: { full_name: String(data.get("name")) },
        emailRedirectTo: `${window.location.origin}/auth/verify-email`
      },
    });

    if (signUpError) {
      toast(signUpError.message, { type: "error" })
      setError(signUpError.message);
    } else {
      toast("Account created. Check your email if confirmation is enabled.", { type: "success" })
      setMessage("Account created. Check your email if confirmation is enabled.");
    }
    setBusy(false);
  }

  return (
    <form onSubmit={submit} className="mt-7 space-y-4">
      <label className="block text-sm font-medium">
        Full name
        <input
          required
          name="name"
          autoComplete="name"
          className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-white outline-none focus:border-[#48d2b2]"
        />
      </label>
      <label className="block text-sm font-medium">
        Email
        <input
          required
          name="email"
          type="email"
          autoComplete="email"
          className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-white outline-none focus:border-[#48d2b2]"
        />
      </label>
      <label className="block text-sm font-medium">
        Password
        <span className="relative mt-2 block">
          <input
            required
            minLength={8}
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 pr-11 text-white outline-none focus:border-[#48d2b2]"
          />
          <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/45 transition hover:text-white">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </span>
      </label>
      {error && (
        <p role="alert" className="text-sm text-red-300">
          {error}
        </p>
      )}
      {message && (
        <p role="status" className="text-sm text-[#9be6d5]">
          {message}
        </p>
      )}
      <button
        disabled={busy}
        className="w-full rounded-xl bg-[#19a878] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
      >
        {busy ? "Creating account…" : "Create account"}
      </button>
    </form>
  );
}
