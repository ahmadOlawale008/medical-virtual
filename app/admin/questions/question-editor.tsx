"use client";

import { FormEvent, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { createClient } from "@/lib/supabase/client";
import { simulationCatalog } from "./simulation-catalog";

type Option = {
  id?: string;
  option_text: string;
  is_correct: boolean;
};

export type AdminQuestion = {
  id: string;
  text: string;
  explanation: string | null;
  simulation_slug: string | null;
  case_study_id?: string | null;
  published: boolean;
  question_options: Option[];
  quiz_questions?: { quiz_id: string; quizzes?: { title: string } | { title: string }[] | null }[];
};

type QuestionEditorProps = {
  initialQuestions: AdminQuestion[];
};

const emptyOptions = (): Option[] => [
  { option_text: "", is_correct: true },
  { option_text: "", is_correct: false },
];

export default function QuestionEditor({
  initialQuestions,
}: QuestionEditorProps) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [selectedSimulation, setSelectedSimulation] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [explanation, setExplanation] = useState("");
  const [options, setOptions] = useState<Option[]>(emptyOptions);
  const [published, setPublished] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterSimulation, setFilterSimulation] = useState("");
  const [busy, setBusy] = useState(false);

  const simulationTitle = useMemo(
    () => simulationCatalog.find((item) => item.slug === selectedSimulation)?.title,
    [selectedSimulation],
  );

  const visibleQuestions = useMemo(
    () => filterSimulation
      ? questions.filter((question) => question.simulation_slug === filterSimulation)
      : questions,
    [filterSimulation, questions],
  );

  function resetForm() {
    setSelectedSimulation("");
    setQuestionText("");
    setExplanation("");
    setOptions(emptyOptions());
    setPublished(true);
    setEditingId(null);
  }

  function editQuestion(question: AdminQuestion) {
    setEditingId(question.id);
    setSelectedSimulation(question.simulation_slug ?? "");
    setQuestionText(question.text);
    setExplanation(question.explanation ?? "");
    setOptions(
      question.question_options.length > 0
        ? question.question_options.map((option) => ({ ...option }))
        : emptyOptions(),
    );
    setPublished(question.published);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateOption(index: number, value: string) {
    setOptions((current) =>
      current.map((option, optionIndex) =>
        optionIndex === index ? { ...option, option_text: value } : option,
      ),
    );
  }

  function selectCorrect(index: number) {
    setOptions((current) =>
      current.map((option, optionIndex) => ({
        ...option,
        is_correct: optionIndex === index,
      })),
    );
  }

  async function saveQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanOptions = options.filter((option) => option.option_text.trim());

    if (!selectedSimulation || !questionText.trim() || cleanOptions.length < 2) {
      toast.error("Choose a simulation, add a question, and provide at least two options.");
      return;
    }

    if (!cleanOptions.some((option) => option.is_correct)) {
      toast.error("Mark one option as the correct answer.");
      return;
    }

    setBusy(true);
    const supabase = createClient();

    const questionPayload = {
      text: questionText.trim(),
      explanation: explanation.trim() || null,
      simulation_slug: selectedSimulation,
      published,
    };

    const questionResult = editingId
      ? await supabase
          .from("questions")
          .update(questionPayload)
          .eq("id", editingId)
          .select("id")
          .single()
      : await supabase
          .from("questions")
          .insert(questionPayload)
          .select("id")
          .single();

    if (questionResult.error || !questionResult.data) {
      toast.error(questionResult.error?.message ?? "Could not save the question.");
      setBusy(false);
      return;
    }

    const questionId = questionResult.data.id;

    if (editingId) {
      const { error: deleteOptionsError } = await supabase
        .from("question_options")
        .delete()
        .eq("question_id", questionId);

      if (deleteOptionsError) {
        toast.error(deleteOptionsError.message);
        setBusy(false);
        return;
      }
    }

    const { data: insertedOptions, error: optionsError } = await supabase
      .from("question_options")
      .insert(
        cleanOptions.map((option) => ({
          question_id: questionId,
          option_text: option.option_text.trim(),
          is_correct: option.is_correct,
        })),
      )
      .select("id, option_text, is_correct");

    if (optionsError) {
      toast.error(optionsError.message);
      setBusy(false);
      return;
    }

    const savedQuestion: AdminQuestion = {
      id: questionId,
      ...questionPayload,
      question_options: insertedOptions ?? cleanOptions,
    };

    setQuestions((current) =>
      editingId
        ? current.map((question) => (question.id === editingId ? savedQuestion : question))
        : [savedQuestion, ...current],
    );
    toast.success(editingId ? "Question updated." : "Question created.");
    resetForm();
    setBusy(false);
  }

  async function deleteQuestion(questionId: string) {
    if (!window.confirm("Delete this question and its answer options?")) return;

    const { error } = await createClient().from("questions").delete().eq("id", questionId);
    if (error) {
      toast.error(error.message);
      return;
    }

    setQuestions((current) => current.filter((question) => question.id !== questionId));
    if (editingId === questionId) resetForm();
    toast.success("Question deleted.");
  }

  async function deleteAllQuestions() {
    const scope = filterSimulation
      ? simulationCatalog.find((item) => item.slug === filterSimulation)?.title
      : "all simulations";
    if (!window.confirm(`Delete every question for ${scope}? This cannot be undone.`)) return;

    const supabase = createClient();
    const query = supabase.from("questions").delete();
    const { error } = filterSimulation
      ? await query.eq("simulation_slug", filterSimulation)
      : await query.not("id", "is", null);

    if (error) {
      toast.error(error.message);
      return;
    }

    setQuestions((current) => filterSimulation
      ? current.filter((question) => question.simulation_slug !== filterSimulation)
      : []);
    resetForm();
    toast.success("Questions deleted.");
  }

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <form onSubmit={saveQuestion} className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[.14em] text-primary">
              {editingId ? "EDIT QUESTION" : "NEW QUESTION"}
            </p>
            <h2 className="mt-2 text-xl font-semibold">
              {editingId ? "Update quiz question" : "Create quiz question"}
            </h2>
          </div>
          {editingId && (
            <button type="button" onClick={resetForm} className="text-xs font-semibold text-muted hover:text-foreground">
              Cancel edit
            </button>
          )}
        </div>

        <label className="mt-6 block text-sm font-medium">
          Simulation
          <select
            required
            value={selectedSimulation}
            onChange={(event) => setSelectedSimulation(event.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-white px-3 py-3 text-sm outline-none focus:border-primary"
          >
            <option value="">Choose a simulation</option>
            <optgroup label="Physiology">
              {simulationCatalog.filter((item) => item.discipline === "Physiology").map((item) => (
                <option key={item.slug} value={item.slug}>{item.title}</option>
              ))}
            </optgroup>
            <optgroup label="Pathophysiology">
              {simulationCatalog.filter((item) => item.discipline === "Pathophysiology").map((item) => (
                <option key={item.slug} value={item.slug}>{item.title}</option>
              ))}
            </optgroup>
          </select>
          {simulationTitle && <span className="mt-2 block text-xs text-muted">Questions will appear after {simulationTitle}.</span>}
        </label>

        <label className="mt-5 block text-sm font-medium">
          Question
          <textarea
            required
            value={questionText}
            onChange={(event) => setQuestionText(event.target.value)}
            rows={4}
            placeholder="Write the question students should answer..."
            className="mt-2 w-full resize-y rounded-xl border border-border px-3 py-3 text-sm outline-none focus:border-primary"
          />
        </label>

        <fieldset className="mt-5">
          <legend className="text-sm font-medium">Answer options</legend>
          <p className="mt-1 text-xs text-muted">Select the radio button beside the correct answer.</p>
          <div className="mt-3 space-y-2">
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correct-option"
                  checked={option.is_correct}
                  onChange={() => selectCorrect(index)}
                  aria-label={`Mark option ${index + 1} as correct`}
                />
                <input
                  value={option.option_text}
                  onChange={(event) => updateOption(index, event.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="min-w-0 flex-1 rounded-lg border border-border px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
                {options.length > 2 && (
                  <button type="button" onClick={() => setOptions((current) => current.filter((_, optionIndex) => optionIndex !== index))} className="px-2 text-xs text-muted hover:text-red-600" aria-label={`Remove option ${index + 1}`}>
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setOptions((current) => [...current, { option_text: "", is_correct: false }])} className="mt-3 text-xs font-semibold text-primary hover:underline">
            + Add option
          </button>
        </fieldset>

        <label className="mt-5 block text-sm font-medium">
          Explanation <span className="font-normal text-muted">(optional)</span>
          <textarea value={explanation} onChange={(event) => setExplanation(event.target.value)} rows={3} placeholder="Explain the answer after submission..." className="mt-2 w-full resize-y rounded-xl border border-border px-3 py-3 text-sm outline-none focus:border-primary" />
        </label>

        <label className="mt-5 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} />
          Publish for students immediately
        </label>

        <button disabled={busy} className="mt-6 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">
          {busy ? "Saving…" : editingId ? "Update question" : "Create question"}
        </button>
      </form>

      <section>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold tracking-[.14em] text-primary">QUESTION BANK</p>
            <h2 className="mt-2 text-xl font-semibold">Created questions</h2>
          </div>
          <span className="text-xs text-muted">{visibleQuestions.length} shown · {questions.length} total</span>
        </div>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <select value={filterSimulation} onChange={(event) => setFilterSimulation(event.target.value)} className="min-w-0 flex-1 rounded-xl border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-primary">
            <option value="">All simulations</option>
            {simulationCatalog.map((item) => <option key={item.slug} value={item.slug}>{item.title}</option>)}
          </select>
          {questions.length > 0 && <button type="button" onClick={deleteAllQuestions} className="rounded-xl border border-red-200 px-3 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50">Delete {filterSimulation ? "filtered" : "all"}</button>}
        </div>
        <div className="mt-4 space-y-3">
          {visibleQuestions.length === 0 && <div className="rounded-2xl border border-dashed border-border bg-white p-6 text-sm text-muted">No questions match this filter.</div>}
          {visibleQuestions.map((question) => {
            const simulation = simulationCatalog.find((item) => item.slug === question.simulation_slug);
            return (
              <article key={question.id} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-primary">{simulation?.title ?? question.simulation_slug ?? "Unassigned simulation"}</p>
                    <h3 className="mt-2 text-sm font-semibold leading-6">{question.text}</h3>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${question.published ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                    {question.published ? "Published" : "Draft"}
                  </span>
                </div>
                <ul className="mt-3 space-y-1 text-xs text-muted">
                  {question.question_options.map((option) => <li key={option.id ?? option.option_text} className={option.is_correct ? "font-semibold text-emerald-700" : ""}>{option.is_correct ? "✓ " : "· "}{option.option_text}</li>)}
                </ul>
                <div className="mt-4 flex gap-3 border-t border-border pt-3">
                  <button type="button" onClick={() => editQuestion(question)} className="text-xs font-semibold text-primary hover:underline">Edit</button>
                  <button type="button" onClick={() => deleteQuestion(question.id)} className="text-xs font-semibold text-red-600 hover:underline">Delete</button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
