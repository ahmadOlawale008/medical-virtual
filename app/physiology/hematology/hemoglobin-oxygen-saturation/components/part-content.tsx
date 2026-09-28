import type { ReactNode } from "react";

const ACTIVITY_ROOT =
  "https://www.humanbiomedia.org/simulations/circulatory-system/blood/altitude-and-hemoglobin-o2-saturation";

const IMAGE_ROOT = "/physiology/hemoglobin-oxygen-saturation";

/** Top-level section of the article (renders an <h2>). */
export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-slate-200 px-5 py-7 first:border-t-0 sm:px-8 sm:py-9">
      <h2 className="text-lg font-semibold tracking-tight text-slate-900">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600">{children}</div>
    </section>
  );
}

/** Mid-level heading inside a section (renders an <h3>). */
export function SubSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-6">
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      <div className="mt-3 space-y-4 text-sm leading-7 text-slate-600">{children}</div>
    </div>
  );
}

/** Minor heading inside a subsection (renders an <h4>). */
export function MinorHeading({ title }: { title: string }) {
  return <h4 className="mt-5 text-sm font-semibold uppercase tracking-[.08em] text-slate-700">{title}</h4>;
}

export function Para({ children }: { children: ReactNode }) {
  return <p>{children}</p>;
}

export function BulletList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5 marker:text-primary">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

/** Tinted callout box for formulas, key facts, and summaries. */
export function Callout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 text-slate-700">
      <p className="text-xs font-semibold uppercase tracking-[.08em] text-teal-800">{title}</p>
      <div className="mt-2 space-y-2 text-sm leading-6">{children}</div>
    </div>
  );
}

/** Illustration from the Human Bio Media simulation assets (served locally). */
export function Figure({
  file,
  alt,
  caption,
  maxWidth = 560,
}: {
  file: string;
  alt: string;
  caption?: string;
  maxWidth?: number;
}) {
  return (
    <figure className="my-5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${IMAGE_ROOT}/${file}`}
        alt={alt}
        className="mx-auto h-auto w-full rounded-xl border border-slate-200"
        style={{ maxWidth }}
      />
      {caption ? (
        <figcaption className="mt-2 text-center text-xs leading-5 text-slate-500">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

/** Embedded Human Bio Media interactive activity (iframe). */
export function Activity({ label, note, file }: { label: string; note: string; file: string }) {
  return (
    <figure className="my-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <figcaption className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2.5">
        <span className="text-xs font-semibold text-slate-600">Interactive activity</span>
        <span className="text-[10px] font-semibold uppercase tracking-[.14em] text-slate-400">{label}</span>
      </figcaption>
      <p className="px-4 pt-3 text-xs leading-5 text-slate-500">{note}</p>
      <div className="overflow-auto pb-3 pt-3">
        <iframe
          src={`${ACTIVITY_ROOT}/${file}`}
          title={label}
          className="block h-[680px] min-w-[800px] w-full border-0"
          allow="autoplay"
        />
      </div>
    </figure>
  );
}
