"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { createClient } from "@/lib/supabase/client";
import { simulationCatalog } from "../questions/simulation-catalog";

export default function SettingsForm({ initialSettings }: { initialSettings: { simulation_slug: string; time_limit_seconds: number | null }[] }) {
  const [settings, setSettings] = useState(initialSettings);
  const [simulation, setSimulation] = useState(simulationCatalog[0]?.slug ?? "");
  const [minutes, setMinutes] = useState("");
  const [saving, setSaving] = useState(false);

  function choose(slug: string) {
    setSimulation(slug);
    const current = settings.find((item) => item.simulation_slug === slug);
    setMinutes(current?.time_limit_seconds ? String(Math.round(current.time_limit_seconds / 60)) : "");
  }

  async function save() {
    const value = minutes.trim() ? Number(minutes) : null;
    if (value !== null && (!Number.isInteger(value) || value < 1 || value > 120)) {
      toast.error("Enter a whole-number limit between 1 and 120 minutes.");
      return;
    }
    setSaving(true);
    const { data, error } = await createClient().from("simulation_quiz_settings").upsert({ simulation_slug: simulation, time_limit_seconds: value === null ? null : value * 60 }).select("simulation_slug, time_limit_seconds").single();
    if (error) toast.error(error.message);
    else { setSettings((current) => [...current.filter((item) => item.simulation_slug !== simulation), data]); toast.success("Quiz setting saved."); }
    setSaving(false);
  }

  return <div className="rounded-2xl border border-border bg-white p-6 shadow-sm"><p className="text-sm leading-6 text-muted">Leave the time empty for an untimed quiz. The countdown begins when a student opens it.</p><div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end"><label className="flex-1 text-sm font-medium">Simulation<select value={simulation} onChange={(event) => choose(event.target.value)} className="mt-2 w-full rounded-xl border border-border bg-white px-3 py-3 text-sm outline-none focus:border-primary">{simulationCatalog.map((item) => <option key={item.slug} value={item.slug}>{item.title}</option>)}</select></label><label className="sm:w-44 text-sm font-medium">Minutes<input type="number" min="1" max="120" value={minutes} onChange={(event) => setMinutes(event.target.value)} placeholder="No limit" className="mt-2 w-full rounded-xl border border-border px-3 py-3 text-sm outline-none focus:border-primary" /></label><button type="button" onClick={save} disabled={saving} className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Saving…" : "Save limit"}</button></div></div>;
}
