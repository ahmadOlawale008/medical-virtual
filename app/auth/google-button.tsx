"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function GoogleButton() {
  const [busy, setBusy] = useState(false);

  async function continueWithGoogle() {
    setBusy(true);
    const { error } = await createClient().auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setBusy(false);
      console.error(error.message);
    }
  }

  return (
    <button
      type="button"
      onClick={continueWithGoogle}
      disabled={busy}
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/15 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
    >

      <span aria-hidden="true" className="text-base font-bold text-[#4285f4]">G</span>
      {busy ? "Connecting…" : "Continue with Google"}
    </button>
  );
}
