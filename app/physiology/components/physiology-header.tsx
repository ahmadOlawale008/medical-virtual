import Link from "next/link";

export default function PhysiologyHeader({
  backToCategories = false,
  backHref,
  backLabel,
}: {
  backToCategories?: boolean;
  /** Overrides the destination of the back link. */
  backHref?: string;
  /** Overrides the text of the back link. */
  backLabel?: string;
}) {
  const href = backHref ?? (backToCategories ? "/physiology" : "/");
  const label = backLabel ?? (backToCategories ? "Physiology categories" : "All disciplines");
  return (
    <header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
      <Link className="font-accent font-bold" href="/">
        MedLab Virtual
      </Link>
      <Link className="cursor-pointer text-sm font-semibold text-primary" href={href}>
        ← {label}
      </Link>
    </header>
  );
}
