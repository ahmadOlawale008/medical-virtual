"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createClient } from "@/lib/supabase/client";
import { simulationCatalog } from "./simulation-catalog";
import type { AdminQuestion } from "./question-editor";
import RichTextEditor from "./rich-text-editor";
import RichTextContent from "@/app/ui/rich-text-content";

type FormOption = { id?: string; option_text: string; is_correct: boolean };
type Quiz = { id: string; title: string; simulation_slug: string };
type CaseStudyOption = { id: string; title: string; simulation_slug: string };
const emptyQuizzes: Quiz[] = [];
const emptyCaseStudies: CaseStudyOption[] = [];

const blankOptions = (): FormOption[] => [
  { option_text: "", is_correct: true },
  { option_text: "", is_correct: false },
];

export default function QuestionForm({ question, initialQuizzes = emptyQuizzes, initialCaseStudies = emptyCaseStudies }: { question?: AdminQuestion; initialQuizzes?: Quiz[]; initialCaseStudies?: CaseStudyOption[] }) {
  const router = useRouter();
  const [simulation, setSimulation] = useState(question?.simulation_slug ?? "");
  const [caseStudyId, setCaseStudyId] = useState(question?.case_study_id ?? "");
  const [text, setText] = useState(question?.text ?? "");
  const [explanation, setExplanation] = useState(question?.explanation ?? "");
  const [published, setPublished] = useState(question?.published ?? true);
  const [availableQuizzes, setAvailableQuizzes] = useState<Quiz[]>(initialQuizzes);
  const [quizLoadError, setQuizLoadError] = useState<string | null>(null);
  const [selectedQuizIds, setSelectedQuizIds] = useState<string[]>(question?.quiz_questions?.map((item) => item.quiz_id) ?? []);
  const [options, setOptions] = useState<FormOption[]>(question?.question_options.length ? question.question_options : blankOptions());
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setQuizLoadError(null);
    const matchingQuizzes = simulation ? initialQuizzes.filter((quiz) => quiz.simulation_slug === simulation) : [];
    setAvailableQuizzes(matchingQuizzes);
    const generalQuizId = matchingQuizzes.find((quiz) => quiz.title.trim().toLowerCase() === "general quiz")?.id;
    setSelectedQuizIds((current) => {
      const selectedMatching = current.filter((id) => matchingQuizzes.some((quiz) => quiz.id === id));
      return !question && generalQuizId && !selectedMatching.includes(generalQuizId) ? [generalQuizId, ...selectedMatching] : selectedMatching;
    });
  }, [initialQuizzes, simulation]);

  // Derived rather than stored so a simulation change can never leave a stale case attached.
  const matchingCaseStudies = simulation ? initialCaseStudies.filter((item) => item.simulation_slug === simulation) : [];
  const activeCaseStudyId = matchingCaseStudies.some((item) => item.id === caseStudyId) ? caseStudyId : "";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanOptions = options.filter((option) => option.option_text.trim());
    if (!simulation || !text.trim() || cleanOptions.length < 2 || !cleanOptions.some((option) => option.is_correct)) {
      toast.error("Choose a simulation, write the question, add two options, and mark one correct answer.");
      return;
    }

    setBusy(true);
    const supabase = createClient();
    const payload = { text: text.trim(), explanation: explanation.trim() || null, simulation_slug: simulation, published, case_study_id: activeCaseStudyId || null };
    const result = question
      ? await supabase.from("questions").update(payload).eq("id", question.id).select("id").single()
      : await supabase.from("questions").insert(payload).select("id").single();

    if (result.error || !result.data) {
      toast.error(result.error?.message ?? "Could not save the question.");
      setBusy(false);
      return;
    }

    if (question) await supabase.from("question_options").delete().eq("question_id", result.data.id);
    const { error: optionsError } = await supabase.from("question_options").insert(cleanOptions.map((option) => ({ question_id: result.data.id, option_text: option.option_text.trim(), is_correct: option.is_correct })));
    if (optionsError) {
      toast.error(optionsError.message);
      setBusy(false);
      return;
    }

    let assignmentIds = Array.from(new Set(selectedQuizIds));
    if (!assignmentIds.length) {
      const { data: generalQuiz, error: generalQuizError } = await supabase.from("quizzes").select("id").eq("simulation_slug", simulation).eq("title", "General Quiz").maybeSingle();
      if (generalQuizError) {
        toast.error(generalQuizError.message);
        setBusy(false);
        return;
      }
      let generalQuizId = generalQuiz?.id;
      if (!generalQuizId) {
        const { data: createdGeneralQuiz, error: createGeneralQuizError } = await supabase.from("quizzes").insert({ title: "General Quiz", simulation_slug: simulation, published: true }).select("id").single();
        if (createGeneralQuizError || !createdGeneralQuiz) {
          toast.error(createGeneralQuizError?.message ?? "Could not create the General Quiz.");
          setBusy(false);
          return;
        }
        generalQuizId = createdGeneralQuiz.id;
      }
      assignmentIds = [generalQuizId];
    }
    const { error: assignmentDeleteError } = await supabase.from("quiz_questions").delete().eq("question_id", result.data.id);
    if (assignmentDeleteError) {
      toast.error(assignmentDeleteError.message);
      setBusy(false);
      return;
    }
    if (assignmentIds.length) {
      const { error: assignmentError } = await supabase.from("quiz_questions").insert(assignmentIds.map((quizId, position) => ({ quiz_id: quizId, question_id: result.data.id, position })));
      if (assignmentError) {
        toast.error(assignmentError.message);
        setBusy(false);
        return;
      }
    }

    toast.success(question ? "Question updated." : "Question created.");
    router.push("/admin/questions");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
      <div className="border-b border-border pb-5">
        <p className="text-xs font-semibold tracking-[.14em] text-primary">{question ? "EDIT QUESTION" : "NEW QUESTION"}</p>
        <h1 className="mt-2 text-2xl font-semibold">{question ? "Update quiz question" : "Create quiz question"}</h1>
        <p className="mt-2 text-sm text-muted">Questions are shown on the matching simulation page after they are published.</p>
      </div>
      <label className="mt-6 block text-sm font-medium">Simulation<select required value={simulation} onChange={(event) => setSimulation(event.target.value)} className="mt-2 w-full rounded-xl border border-border bg-white px-3 py-3 text-sm outline-none focus:border-primary"><option value="">Choose a simulation</option><optgroup label="Physiology">{simulationCatalog.filter((item) => item.discipline === "Physiology").map((item) => <option key={item.slug} value={item.slug}>{item.title}</option>)}</optgroup><optgroup label="Pathophysiology">{simulationCatalog.filter((item) => item.discipline === "Pathophysiology").map((item) => <option key={item.slug} value={item.slug}>{item.title}</option>)}</optgroup></select></label>
      {matchingCaseStudies.length > 0 && <label className="mt-5 block text-sm font-medium">Patient case study <span className="font-normal text-muted">(optional)</span><select value={activeCaseStudyId} onChange={(event) => setCaseStudyId(event.target.value)} className="mt-2 w-full rounded-xl border border-border bg-white px-3 py-3 text-sm outline-none focus:border-primary"><option value="">Not part of a case study</option>{matchingCaseStudies.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select><span className="mt-1 block text-xs text-muted">The patient vignette is shown above the question during the quiz.</span></label>}
      <label className="mt-5 block text-sm font-medium">
        Question
        <RichTextEditor value={text} onChange={setText} />
        <div className="mt-4 rounded-xl border border-border bg-slate-50 p-4">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[.14em] text-muted">Preview</p>
          {text ? <RichTextContent html={text} className="text-sm leading-6" /> : <p className="text-sm text-muted">Your formatted question will appear here.</p>}
        </div>
      </label>
      <fieldset className="mt-5 rounded-2xl border border-border bg-slate-50/80 p-4">
        <legend className="px-1 text-sm font-semibold">Assign to quizzes <span className="font-normal text-muted">(optional)</span></legend>
        <p className="mt-1 text-xs leading-5 text-muted">General Quiz starts selected as a convenient default. You can remove it and choose another quiz, but every question must belong to at least one quiz.</p>
        {quizLoadError ? <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">Could not load quizzes: {quizLoadError}</p> : !simulation ? <p className="mt-4 rounded-xl border border-dashed border-border bg-white p-4 text-sm text-muted">Select a simulation above to see its quizzes.</p> : availableQuizzes.length === 0 ? <p className="mt-4 rounded-xl border border-dashed border-border bg-white p-4 text-sm text-muted">No quizzes match this simulation yet. A General Quiz will be created automatically if you save without choosing another quiz.</p> : <div className="mt-4 space-y-2">{availableQuizzes.map((quiz) => { const isGeneralQuiz = quiz.title.trim().toLowerCase() === "general quiz"; const isSelected = selectedQuizIds.includes(quiz.id); return <label key={quiz.id} className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border bg-white px-3 py-2.5 text-sm transition ${isSelected ? "border-primary bg-primary-soft/30" : "border-border hover:border-primary/50"}`}><input type="checkbox" checked={isSelected} onChange={(event) => setSelectedQuizIds((current) => event.target.checked ? [...current, quiz.id] : current.filter((id) => id !== quiz.id))} /><span className="min-w-0 flex-1 font-medium">{quiz.title}</span><span className="text-xs text-muted">{isGeneralQuiz ? "Default" : isSelected ? "Selected" : "Add"}</span></label>; })}</div>}
        {simulation && availableQuizzes.length > 0 && <div className="mt-3 flex items-center justify-between text-xs text-muted"><span>{selectedQuizIds.filter((id) => availableQuizzes.find((quiz) => quiz.id === id)?.title.trim().toLowerCase() !== "general quiz").length} extra quiz{selectedQuizIds.filter((id) => availableQuizzes.find((quiz) => quiz.id === id)?.title.trim().toLowerCase() !== "general quiz").length === 1 ? "" : "zes"} selected</span>{selectedQuizIds.length > 0 && <button type="button" onClick={() => setSelectedQuizIds(selectedQuizIds.filter((id) => availableQuizzes.find((quiz) => quiz.id === id)?.title.trim().toLowerCase() === "general quiz"))} className="font-semibold text-primary hover:underline">Clear extras</button>}</div>}
      </fieldset>
      <fieldset className="mt-5"><legend className="text-sm font-medium">Answer options</legend><p className="mt-1 text-xs text-muted">Select the radio button beside the correct answer.</p><div className="mt-3 space-y-2">{options.map((option, index) => <div key={index} className="flex items-center gap-2"><input type="radio" name="correct-option" checked={option.is_correct} onChange={() => setOptions((current) => current.map((item, optionIndex) => ({ ...item, is_correct: optionIndex === index })))} aria-label={`Mark option ${index + 1} correct`} /><input value={option.option_text} onChange={(event) => setOptions((current) => current.map((item, optionIndex) => optionIndex === index ? { ...item, option_text: event.target.value } : item))} placeholder={`Option ${index + 1}`} className="min-w-0 flex-1 rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-primary" />{options.length > 2 && <button type="button" onClick={() => setOptions((current) => current.filter((_, optionIndex) => optionIndex !== index))} className="text-xs text-red-600">Remove</button>}</div>)}</div><button type="button" onClick={() => setOptions((current) => [...current, { option_text: "", is_correct: false }])} className="mt-3 text-xs font-semibold text-primary hover:underline">+ Add option</button></fieldset>
      <label className="mt-5 block text-sm font-medium">Explanation <span className="font-normal text-muted">(optional)</span><textarea value={explanation} onChange={(event) => setExplanation(event.target.value)} rows={3} placeholder="Explain the answer after submission..." className="mt-2 w-full resize-y rounded-xl border border-border px-3 py-3 text-sm outline-none focus:border-primary" /></label>
      <label className="mt-5 flex items-center gap-2 text-sm"><input type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} /> Publish for students immediately</label>
      <div className="mt-6 flex gap-3"><button type="submit" disabled={busy} className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">{busy ? "Saving…" : question ? "Update question" : "Create question"}</button><button type="button" onClick={() => router.push("/admin/questions")} className="rounded-xl border border-border px-4 py-3 text-sm font-semibold text-muted">Cancel</button></div>
    </form>
  );
}
