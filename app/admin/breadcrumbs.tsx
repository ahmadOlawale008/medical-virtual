import Link from "next/link";

export default function AdminBreadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs text-muted">
      <Link href="/admin/questions" className="font-semibold hover:text-primary">Admin</Link>
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-2">
          <span aria-hidden="true">/</span>
          {item.href ? <Link href={item.href} className="font-semibold hover:text-primary">{item.label}</Link> : <span className="text-foreground">{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}
