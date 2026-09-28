import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/app/admin/admin-shell";
import AdminBreadcrumbs from "../../../breadcrumbs";
import RichTextContent from "@/app/ui/rich-text-content";
import { simulationCatalog } from "../../simulation-catalog";

export default async function PreviewQuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/student/questions");
  const { data: question } = await supabase.from("questions").select("id, text, explanation, simulation_slug, published, question_options(id, option_text, is_correct)").eq("id", id).single();
  if (!question) notFound();
  const simulation = simulationCatalog.find((item) => item.slug === question.simulation_slug);
  return <AdminShell><AdminBreadcrumbs items={[{ label: "Questions", href: "/admin/questions" }, { label: "Edit question", href: `/admin/questions/${id}/edit` }, { label: "Preview" }]} /><div className="mx-auto max-w-3xl"><div className="mb-6 flex items-center justify-between"><div><p className="text-xs font-semibold tracking-[.14em] text-primary">QUESTION PREVIEW</p><h1 className="mt-2 text-2xl font-semibold">{simulation?.title ?? question.simulation_slug}</h1></div><Link href={`/admin/questions/${id}/edit`} className="rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold text-primary shadow-sm">Edit</Link></div><article className="rounded-2xl border border-border bg-white p-6 shadow-sm"><div className="flex flex-wrap gap-2 text-xs"><span className={`rounded-full px-2.5 py-1 font-semibold ${question.published ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{question.published ? "Published" : "Draft"}</span><span className="rounded-full bg-primary-soft px-2.5 py-1 font-semibold text-primary">Availability follows assigned quizzes</span></div><RichTextContent html={question.text} className="mt-6 text-lg font-semibold leading-8" /><div className="mt-6 space-y-3">{question.question_options.map((option, index) => <div key={option.id} className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-sm"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold">{String.fromCharCode(65 + index)}</span><span>{option.option_text}</span></div>)}</div>{question.explanation && <div className="mt-6 border-t border-border pt-5"><p className="text-xs font-semibold uppercase tracking-[.12em] text-muted">Explanation</p><p className="mt-2 text-sm leading-6 text-muted">{question.explanation}</p></div>}</article></div></AdminShell>;
}
