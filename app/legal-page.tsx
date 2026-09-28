import Link from "next/link";

type LegalPageProps = {
  title: string;
  label: string;
  intro: string;
  children: React.ReactNode;
};

export default function LegalPage({ title, label, intro, children }: LegalPageProps) {
  return (
    <main className="min-h-dvh bg-[#f5f7f6] px-4 py-8 text-slate-900 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-xs text-slate-600 transition hover:text-[#087f73]">
          ← Go to MedLab home
        </Link>
        <article className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-10">
          <p className="text-[11px] font-semibold tracking-[.14em] text-[#087f73]">{label}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
          <p className="mt-4 border-l-2 border-[#1aa88a] pl-4 text-sm leading-6 text-slate-600">{intro}</p>
          <div className="mt-8 space-y-8 text-sm leading-7 text-slate-600">{children}</div>
          <p className="mt-10 border-t border-slate-200 pt-5 text-xs text-slate-400">Last updated: September 17, 2026</p>
        </article>
      </div>
    </main>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <div className="mt-2">{children}</div>
    </section>
  );
}
