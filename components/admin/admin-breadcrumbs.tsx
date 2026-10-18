"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Crumb = { href: string; label: string };

function titleCase(segment: string) {
  return segment
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

export function AdminBreadcrumbs({ extra }: { extra?: Crumb[] }) {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);

  const base: Crumb[] = [
    { href: "/admin/dashboard", label: "Admin" },
    { href: "/admin/content", label: "Content" },
  ];

  const dynamic: Crumb[] = [];
  let accum = "";
  for (const part of parts.slice(2) /* skip 'admin', 'content' */) {
    accum += `/${part}`;
    dynamic.push({ href: `/admin/content${accum}`, label: titleCase(part) });
  }

  const crumbs = [...base, ...dynamic, ...(extra ?? [])];

  return (
    <nav className="text-xs text-slate-600" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1">
        {crumbs.map((c, idx) => (
          <li key={`${c.href}-${idx}`} className="flex items-center gap-1">
            {idx > 0 && <span className="opacity-50">/</span>}
            <Link href={c.href} className="hover:underline">
              {c.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
