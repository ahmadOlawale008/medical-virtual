"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createClient } from "@/lib/supabase/client";
import { simulationCatalog } from "../questions/simulation-catalog";

type Preset = { id: string; name: string; availability_type: "all_time" | "date_range"; available_from: string | null; available_until: string | null };

export default function QuizForm({ presets }: { presets: Preset[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [simulation, setSimulation] = useState("");
  const [description, setDescription] = useState("");
  const [presetId, setPresetId] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [published, setPublished] = useState(true);
  const [oneTimeUse, setOneTimeUse] = useState(false);
  const [showResultAfterSubmit, setShowResultAfterSubmit] = useState(true);
  const [newPreset, setNewPreset] = useState(false);
  const [presetName, setPresetName] = useState("");
  const [availabilityType, setAvailabilityType] = useState<"all_time" | "date_range">("all_time");
  const [from, setFrom] = useState("");
  const [until, setUntil] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !simulation || (!newPreset && !presetId && availabilityType === "date_range") || (newPreset && (!presetName.trim() || (availabilityType === "date_range" && (!from || !until || until < from))))) {
      toast.error("Add a title, simulation, and valid availability.");
      return;
    }
    setBusy(true);
    const supabase = createClient();
    let selectedPresetId = presetId || null;
    if (newPreset) {
      const { data, error } = await supabase.from("availability_presets").insert({ name: presetName.trim(), simulation_slug: simulation, availability_type: availabilityType, available_from: availabilityType === "date_range" ? from : null, available_until: availabilityType === "date_range" ? until : null }).select("id").single();
      if (error || !data) { toast.error(error?.message ?? "Could not create availability preset."); setBusy(false); return; }
      selectedPresetId = data.id;
    }
    const { data, error } = await supabase.from("quizzes").insert({ title: title.trim(), simulation_slug: simulation, description: description.trim() || null, availability_preset_id: selectedPresetId, time_limit_seconds: timeLimit ? Number(timeLimit) * 60 : null, published, one_time_use: oneTimeUse, show_result_after_submit: showResultAfterSubmit }).select("id").single();
    if (error || !data) { toast.error(error?.message ?? "Could not create quiz."); setBusy(false); return; }
    toast.success("Quiz created. Now add its questions.");
    router.push(`/admin/quizzes/${data.id}`);
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold tracking-[.14em] text-primary">NEW QUIZ</p>
      <h1 className="mt-2 text-2xl font-semibold">Create a quiz</h1>
      <p className="mt-2 text-sm leading-6 text-muted">Create the quiz first, then choose the questions that belong to it.</p>
      <label className="mt-6 block text-sm font-medium">Quiz name<input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="First Semester Quiz" className="mt-2 w-full rounded-xl border border-border px-3 py-3 text-sm outline-none focus:border-primary" /></label>
      <label className="mt-5 block text-sm font-medium">Simulation<select required value={simulation} onChange={(event) => setSimulation(event.target.value)} className="mt-2 w-full rounded-xl border border-border bg-white px-3 py-3 text-sm outline-none focus:border-primary"><option value="">Choose a simulation</option>{simulationCatalog.map((item) => <option key={item.slug} value={item.slug}>{item.title}</option>)}</select></label>
      <label className="mt-5 block text-sm font-medium">Description<span className="font-normal text-muted"> (optional)</span><textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={2} className="mt-2 w-full resize-y rounded-xl border border-border px-3 py-3 text-sm outline-none focus:border-primary" /></label>
      <details className="mt-6 rounded-2xl border border-border bg-slate-50 p-4">
        <summary className="cursor-pointer list-none text-sm font-semibold">Quiz settings <span className="font-normal text-muted">(availability, timing, and publishing)</span></summary>
        <div className="mt-4">
          <fieldset className="rounded-xl border border-border bg-white p-4"><legend className="px-1 text-sm font-medium">Availability</legend><select value={newPreset ? "new" : presetId} onChange={(event) => { if (event.target.value === "new") { setNewPreset(true); setPresetId(""); } else { setNewPreset(false); setPresetId(event.target.value); } }} className="mt-2 w-full rounded-xl border border-border bg-white px-3 py-3 text-sm"><option value="">All time (no expiry)</option>{presets.map((preset) => <option key={preset.id} value={preset.id}>{preset.name}{preset.availability_type === "date_range" ? ` (${preset.available_from} – ${preset.available_until})` : " (All time)"}</option>)}<option value="new">+ Create named availability preset</option></select>{newPreset && <div className="mt-3 space-y-3"><input required value={presetName} onChange={(event) => setPresetName(event.target.value)} placeholder="First Semester Quiz" className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm" /><div className="flex gap-4 text-sm"><label className="flex items-center gap-2"><input type="radio" name="new-preset-type" checked={availabilityType === "all_time"} onChange={() => setAvailabilityType("all_time")} /> All time</label><label className="flex items-center gap-2"><input type="radio" name="new-preset-type" checked={availabilityType === "date_range"} onChange={() => setAvailabilityType("date_range")} /> Date range</label></div>{availabilityType === "date_range" && <div className="grid gap-3 sm:grid-cols-2"><input required type="date" value={from} onChange={(event) => setFrom(event.target.value)} className="rounded-lg border border-border bg-white px-3 py-2.5 text-sm" /><input required type="date" min={from || undefined} value={until} onChange={(event) => setUntil(event.target.value)} className="rounded-lg border border-border bg-white px-3 py-2.5 text-sm" /></div>}</div>}</fieldset>
          <label className="mt-4 block text-sm font-medium">Time limit<span className="font-normal text-muted"> (minutes, optional)</span><input type="number" min="1" max="120" value={timeLimit} onChange={(event) => setTimeLimit(event.target.value)} className="mt-2 w-full rounded-xl border border-border bg-white px-3 py-3 text-sm outline-none focus:border-primary" /></label>
          <label className="mt-4 flex items-center gap-2 text-sm"><input type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} /> Publish for students</label>
          <fieldset className="mt-4 rounded-xl border border-border bg-white p-4"><legend className="px-1 text-sm font-medium">Student experience</legend><label className="flex items-start gap-3 text-sm"><input type="checkbox" checked={oneTimeUse} onChange={(event) => setOneTimeUse(event.target.checked)} className="mt-0.5" /><span><strong>One-time quiz</strong><span className="block text-xs leading-5 text-muted">Each student can submit this quiz only once.</span></span></label><label className="mt-4 flex items-start gap-3 text-sm"><input type="checkbox" checked={showResultAfterSubmit} onChange={(event) => setShowResultAfterSubmit(event.target.checked)} className="mt-0.5" /><span><strong>Show result after submission</strong><span className="block text-xs leading-5 text-muted">Let students see their score immediately.</span></span></label></fieldset>
        </div>
      </details>
      <button disabled={busy} className="mt-6 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">{busy ? "Creating..." : "Create quiz and add questions"}</button>
    </form>
  );
}
