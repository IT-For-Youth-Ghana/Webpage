"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Node = { key: string; label: string; type: "singleton" | "collection"; adminPath: string; previewHref?: string };

export function HubNodeSearch({ nodes }: { nodes: Node[] }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return nodes;
    return nodes.filter((node) =>
      [node.label, node.key, node.adminPath, node.previewHref ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [q, nodes]);

  return (
    <div className="space-y-3">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search pages in this hub…"
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-accent"
      />
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((node) => (
          <li key={node.key} className="rounded-xl border border-brand-border bg-white p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold">{node.label}</p>
                <p className="text-xs text-slate-600">{node.type === "collection" ? "Collection" : "Page"}</p>
              </div>
              <Link
                href={node.adminPath}
                className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Open
              </Link>
            </div>
            {node.previewHref ? (
              <div className="mt-2">
                <Link href={node.previewHref} className="text-xs text-brand-deep hover:underline">
                  Preview: {node.previewHref}
                </Link>
              </div>
            ) : null}
          </li>
        ))}
      </ul>
      {!filtered.length ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
          No pages matched your search.
        </div>
      ) : null}
    </div>
  );
}
