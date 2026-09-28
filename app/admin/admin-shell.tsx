import SiteHeader from "@/app/ui/site-header";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SiteHeader />
      <main className="px-4 py-10">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="h-fit rounded-2xl border border-border bg-white p-3 shadow-sm lg:sticky lg:top-5">
            <p className="px-3 py-2 text-[10px] font-semibold tracking-[.14em] text-muted">ADMIN MENU</p>
            <nav className="space-y-1" aria-label="Admin sections">
              <a href="/admin/questions" className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-muted hover:bg-primary-soft hover:text-primary">Question bank</a>
              <a href="/admin/questions/new" className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-muted hover:bg-primary-soft hover:text-primary">New question</a>
              <a href="/admin/quizzes" className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-muted hover:bg-primary-soft hover:text-primary">Quizzes</a>
              <a href="/admin/results" className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-muted hover:bg-primary-soft hover:text-primary">Student results</a>
            </nav>
          </aside>
          <div className="min-w-0">{children}</div>
        </div>
      </main>
    </div>
  );
}
