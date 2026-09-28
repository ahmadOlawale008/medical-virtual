"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createClient } from "@/lib/supabase/client";

type Preset = { id: string; name: string; availability_type: "all_time" | "date_range"; available_from: string | null; available_until: string | null };

type QuizConfigurationFormProps = {
  quiz: { id: string; title: string; description: string | null; time_limit_seconds: number | null; published: boolean; availability_preset_id: string | null; one_time_use: boolean; show_result_after_submit: boolean };
  presets: Preset[];
};

export default function QuizConfigurationForm({ quiz, presets }: QuizConfigurationFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(quiz.title);
  const [description, setDescription] = useState(quiz.description ?? "");
  const [timeLimit, setTimeLimit] = useState(quiz.time_limit_seconds ? String(quiz.time_limit_seconds / 60) : "");
  const [presetId, setPresetId] = useState(quiz.availability_preset_id ?? "");
  const [published, setPublished] = useState(quiz.published);
  const [oneTimeUse, setOneTimeUse] = useState(quiz.one_time_use);
  const [showResultAfterSubmit, setShowResultAfterSubmit] = useState(quiz.show_result_after_submit);
  const [busy, setBusy] = useState(false);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || (timeLimit && (Number(timeLimit) < 1 || Number(timeLimit) > 120))) {
      toast.error("Add a quiz name and a time limit between 1 and 120 minutes.");
      return;
    }
    setBusy(true);
    const { error } = await createClient().from("quizzes").update({
      title: title.trim(),
      description: description.trim() || null,
      availability_preset_id: presetId || null,
      time_limit_seconds: timeLimit ? Number(timeLimit) * 60 : null,
      published,
      one_time_use: oneTimeUse,
      show_result_after_submit: showResultAfterSubmit,
      updated_at: new Date().toISOString(),
    }).eq("id", quiz.id);
    if (error) {
      toast.error(error.message);
      setBusy(false);
      return;
    }
    toast.success("Quiz configuration saved.");
    setBusy(false);
    router.refresh();
  }

  return (
    <form onSubmit={save} className="mt-6 rounded-2xl border border-border bg-white p-6 shadow-sm">
      <div className="border-b border-border pb-5"><p className="text-xs font-semibold tracking-[.14em] text-primary">QUIZ CONFIGURATION</p><h2 className="mt-2 text-2xl font-semibold">Update quiz settings</h2><p className="mt-2 text-sm leading-6 text-muted">These settings apply only to this quiz.</p></div>
      <label className="mt-6 block text-sm font-medium">Quiz name<input required value={title} onChange={(event) => setTitle(event.target.value)} className="mt-2 w-full rounded-xl border border-border px-3 py-3 text-sm outline-none focus:border-primary" /></label>
      <label className="mt-5 block text-sm font-medium">Description <span className="font-normal text-muted">(optional)</span><textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} className="mt-2 w-full resize-y rounded-xl border border-border px-3 py-3 text-sm outline-none focus:border-primary" /></label>
      <fieldset className="mt-5 rounded-xl border border-border bg-slate-50 p-4"><legend className="px-1 text-sm font-medium">Availability</legend><select value={presetId} onChange={(event) => setPresetId(event.target.value)} className="mt-2 w-full rounded-xl border border-border bg-white px-3 py-3 text-sm"><option value="">All time (no expiry)</option>{presets.map((preset) => <option key={preset.id} value={preset.id}>{preset.name}{preset.availability_type === "date_range" ? ` (${preset.available_from} - ${preset.available_until})` : " (All time)"}</option>)}</select></fieldset>
      <label className="mt-5 block text-sm font-medium">Time limit <span className="font-normal text-muted">(minutes, optional)</span><input type="number" min="1" max="120" value={timeLimit} onChange={(event) => setTimeLimit(event.target.value)} className="mt-2 w-full rounded-xl border border-border px-3 py-3 text-sm outline-none focus:border-primary" /></label>
      <label className="mt-5 flex items-center gap-2 text-sm"><input type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} /> Publish for students</label>
      <fieldset className="mt-5 rounded-xl border border-border bg-slate-50 p-4"><legend className="px-1 text-sm font-medium">Student experience</legend><label className="flex items-start gap-3 text-sm"><input type="checkbox" checked={oneTimeUse} onChange={(event) => setOneTimeUse(event.target.checked)} className="mt-0.5" /><span><strong>One-time quiz</strong><span className="block text-xs leading-5 text-muted">Each student can submit this quiz only once.</span></span></label><label className="mt-4 flex items-start gap-3 text-sm"><input type="checkbox" checked={showResultAfterSubmit} onChange={(event) => setShowResultAfterSubmit(event.target.checked)} className="mt-0.5" /><span><strong>Show result after submission</strong><span className="block text-xs leading-5 text-muted">Let students see their score immediately after completing the quiz.</span></span></label></fieldset>
      <button type="submit" disabled={busy} className="mt-6 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">{busy ? "Saving..." : "Save configuration"}</button>
    </form>
  );
}
