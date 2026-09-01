import Link from "next/link";

export default function PhysiologyHeader({ backToCategories = false }: { backToCategories?: boolean }) {
  return (
    <header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
      <Link className="font-accent font-bold" href="/">
        MedLab Virtual
      </Link>
      <Link
        className="cursor-pointer text-sm font-semibold text-primary"
        href={backToCategories ? "/physiology" : "/"}
      >
        ← {backToCategories ? "Physiology categories" : "All disciplines"}
      </Link>
    </header>
  );
}
