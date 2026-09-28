import type { ReactNode } from "react";
import Link from "next/link";

type Discipline = {
  number: string;
  title: string;
  description: string;
  topics: string[];
  href: string;
  available: boolean;
  icon: ReactNode;
};

const disciplines: Discipline[] = [
  {
    number: "01",
    title: "Physiology",
    description:
      "Investigate how organ systems function, regulate, and respond to change.",
    topics: ["Hematology Lab", "Amphibian Physiology", "Microscope Master"],
    href: "/physiology",
    available: true,
    icon: (
      <path d="M3 12h4l2-5 4 11 3-7 2 3h3M7 4h10M7 20h10" />
    ),
  },
  
  {
    number: "02",
    title: "Pathophysiology",
    description:
      "Connect altered biological mechanisms with signs, symptoms, and data.",
    topics: ["Disease mechanisms", "Clinical cases", "Compensation"],
    href: "/pathophysiology",
    available: true,
    icon: (
      <>
        <path d="M12 3 4 7v5c0 5 3.4 8 8 9 4.6-1 8-4 8-9V7l-8-4Z" />
        <path d="M8 12h8M12 8v8" />
      </>
    ),
  },
];

export default function DisciplineExplorer() {
  return (
    <div
      className="grid gap-3 sm:grid-cols-2"
      aria-label="Medical science disciplines"
    >
      {disciplines.map((discipline) => {
        const content = (
          <>
          <div className="flex items-start justify-between gap-4">
            <span
              aria-hidden="true"
              className="grid size-10 place-items-center rounded-md bg-primary-soft text-primary transition-colors group-hover:bg-primary group-hover:text-white"
            >
              <svg
                className="size-5 fill-none stroke-current stroke-[1.6] [stroke-linecap:round] [stroke-linejoin:round]"
                viewBox="0 0 24 24"
              >
                {discipline.icon}
              </svg>
            </span>
            <span className="text-xs text-muted">
              {discipline.available ? "Open lab" : "Coming soon"}
            </span>
          </div>

          <h3 className="mt-5 text-lg font-semibold">{discipline.title}</h3>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted">
            {discipline.description}
          </p>

          <ul
            className="mt-5 flex flex-wrap gap-2"
            aria-label={`${discipline.title} topics`}
          >
            {discipline.topics.map((topic) => (
              <li
                key={topic}
                className="rounded-sm border border-border bg-white px-2.5 py-1 text-[11px] text-muted"
              >
                {topic}
              </li>
            ))}
          </ul>
          </>
        );

        return (
          <Link
            key={discipline.title}
            href={discipline.href}
            className="group cursor-pointer rounded-lg border border-border bg-surface p-5 transition-colors hover:border-primary/40 hover:bg-primary-soft focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-secondary sm:p-6"
          >
            {content}
            <span className="card-action mt-5 inline-flex items-center text-xs font-semibold text-primary">
              {discipline.available ? "Enter simulation" : "View discipline"} →
            </span>
          </Link>
        );
      })}
    </div>
  );
}
