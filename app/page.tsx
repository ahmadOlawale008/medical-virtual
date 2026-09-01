import DisciplineExplorer from "./ui/discipline-explorer";

function BrandMark() {
  return (
    <span
      aria-hidden="true"
      className="grid size-9 place-items-center rounded-md bg-primary text-white"
    >
      <svg
        className="size-5 fill-none stroke-current stroke-[1.8]"
        viewBox="0 0 32 32"
      >
        <path d="M16 5v22M5 16h22" />
        <path d="M9 9c4.5 2 9.5 2 14 0M9 23c4.5-2 9.5-2 14 0" />
      </svg>
    </span>
  );
}

function AnatomyPanel() {
  return (
    <div className="relative min-h-80 overflow-hidden border-l border-white/15 bg-[#123e3a] sm:min-h-96">
      <div className="absolute inset-0 medical-grid opacity-30" />

      <div className="absolute left-5 top-5 z-10 flex items-center gap-2 text-[11px] text-white/70">
        <span className="size-2 bg-secondary" />
        Interactive model preview
      </div>

      <svg
        className="absolute left-1/2 top-1/2 h-[88%] w-[82%] -translate-x-1/2 -translate-y-1/2"
        viewBox="0 0 420 420"
        aria-hidden="true"
      >
        <circle
          cx="210"
          cy="210"
          r="154"
          fill="none"
          stroke="rgba(255,255,255,.12)"
        />
        <path
          d="M210 56v308M56 210h308"
          fill="none"
          stroke="rgba(255,255,255,.08)"
        />
        <path
          d="M178 108c-34 12-55 48-54 98 1 53 24 91 63 105 17 6 25-10 24-29l-3-138c-1-25-10-43-30-36Zm64 0c34 12 55 48 54 98-1 53-24 91-63 105-17 6-25-10-24-29l3-138c1-25 10-43 30-36Z"
          fill="rgba(120,205,190,.18)"
          stroke="#8ad0c3"
          strokeWidth="2"
        />
        <path
          d="M210 72v78m0-31-30 27m30-27 30 27M178 172l-27 34m91-34 27 34"
          fill="none"
          stroke="#d7eee9"
          strokeLinecap="round"
          strokeWidth="4"
        />
        <path
          d="M210 234c-16-26-54-15-54 16 0 37 54 67 54 67s54-30 54-67c0-31-38-42-54-16Z"
          fill="#d97942"
          stroke="#f3b38d"
          strokeWidth="2"
        />
        <path
          d="M65 341h72l12-14 14 29 18-63 20 88 18-40h39l12-13 13 25 16-48 18 66 17-30h71"
          fill="none"
          stroke="#f0a06f"
          strokeWidth="2"
        />
      </svg>

      <div className="absolute bottom-5 left-5 z-10 rounded-sm border border-white/15 bg-[#0f322f]/90 px-3 py-2 text-white">
        <span className="block text-[10px] text-white/55">SYSTEM</span>
        <strong className="text-xs font-semibold">Cardiorespiratory</strong>
      </div>

      <div className="absolute bottom-5 right-5 z-10 text-right text-[10px] leading-5 text-white/55">
        Rotate · isolate · observe
      </div>
    </div>
  );
}

const capabilities = [
  {
    number: "01",
    title: "Learn the mechanism",
    description:
      "Review concise theory, labeled structures, equations, and experimental context before each lab.",
  },
  {
    number: "02",
    title: "Run the experiment",
    description:
      "Change physiological or pharmacological variables and observe the model respond in real time.",
  },
  {
    number: "03",
    title: "Interpret the data",
    description:
      "Compare trials, read graphs, test your reasoning, and understand the limits of each simulation.",
  },
];

export default function Home() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <a
        href="#main-content"
        className="fixed left-4 top-3 z-50 -translate-y-20 rounded-md bg-white px-4 py-2 text-sm font-semibold text-primary focus:translate-y-0"
      >
        Skip to content
      </a>

      <header className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <a
          className="flex items-center gap-3"
          href="#top"
          aria-label="MedLab Virtual home"
        >
          <BrandMark />
          <span className="font-accent text-base font-bold tracking-tight">
            MedLab Virtual
          </span>
        </a>

        <nav className="hidden items-center gap-7 text-sm text-muted sm:flex">
          <a className="hover:text-primary" href="#disciplines">
            Disciplines
          </a>
          <a className="hover:text-primary" href="#how-it-works">
            How it works
          </a>
        </nav>

        <span className="border-l-2 border-secondary pl-3 text-sm font-semibold text-primary">
          Free access
        </span>
      </header>

      <main id="main-content">
        <section
          id="top"
          className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-xl bg-[#0d302d] text-white lg:grid-cols-[1.08fr_0.92fr]"
        >
          <div className="flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-12 lg:py-16">
            {/* <p className="text-xs font-semibold tracking-[0.12em] text-[#8fd0c4]">
              FOR 400-LEVEL &amp; GRADUATE STUDENTS
            </p> */}

            <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-[1.08] tracking-[-0.035em] sm:text-5xl">
              Study medical science through virtual experiments.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-white/70">
              MedLab Virtual combines anatomy, physiology, pharmacology, and
              pathophysiology in guided laboratories you can explore from any
              browser—at no cost.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                className="inline-flex min-h-11 items-center rounded-md bg-secondary px-5 text-sm font-semibold text-[#24140b] transition-colors hover:bg-[#ee9562] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-white"
                href="#disciplines"
              >
                Explore laboratories
              </a>
              <a
                className="inline-flex min-h-11 items-center rounded-md border border-white/25 px-5 text-sm font-semibold transition-colors hover:bg-white/10 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-white"
                href="#how-it-works"
              >
                How the platform works
              </a>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/15 pt-5 text-xs text-white/60">
              <span>No account required</span>
              <span>Browser based</span>
              <span>Educational use</span>
            </div>
          </div>

          <AnatomyPanel />
        </section>

        <section
          id="disciplines"
          className="mx-auto w-full max-w-6xl px-4 py-14 sm:py-16"
          aria-labelledby="disciplines-title"
        >
          <div className="mb-7 grid gap-3 border-b border-border pb-5 sm:grid-cols-[1fr_1fr] sm:items-end">
            <div>
              <p className="text-xs font-semibold text-primary">DISCIPLINES</p>
              <h2
                id="disciplines-title"
                className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl"
              >
                Choose an area to investigate
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-muted sm:justify-self-end">
              Each discipline contains guided explanations, interactive models,
              practical exercises, and questions for advanced study.
            </p>
          </div>

          <DisciplineExplorer />
        </section>

        <section id="how-it-works" className="bg-[#e5f1ee]">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-14 lg:grid-cols-[0.7fr_1.3fr] lg:py-16">
            <div>
              <p className="text-xs font-semibold text-primary">HOW IT WORKS</p>
              <h2 className="mt-2 max-w-sm text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
                From explanation to evidence.
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-6 text-muted">
                Every laboratory is structured to help you understand what you
                are changing, observe what happens, and explain why.
              </p>
            </div>

            <ol className="grid border-t border-primary/20 sm:grid-cols-3 sm:border-l sm:border-t-0">
              {capabilities.map((capability) => (
                <li
                  key={capability.number}
                  className="border-b border-primary/20 py-5 sm:border-b-0 sm:border-r sm:px-5"
                >
                  <span className="text-xs font-semibold text-secondary">
                    {capability.number}
                  </span>
                  <h3 className="mt-5 font-semibold">{capability.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {capability.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Free and open to students</h2>
            <p className="mt-1 text-sm text-muted">
              Learn independently, prepare for class, or supplement practical work.
            </p>
          </div>
          <a
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-[#066a64] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-secondary"
            href="#disciplines"
          >
            Browse disciplines
          </a>
        </section>
      </main>

      <footer className="border-t border-border bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>Educational use only—not clinical decision support.</p>
          <p>© 2026 MedLab Virtual</p>
        </div>
      </footer>
    </div>
  );
}
