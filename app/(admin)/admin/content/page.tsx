import Link from "next/link";

import { getHubs, getNodesForHub } from "@/lib/content/admin-registry";
import { AdminBreadcrumbs } from "@/components/admin/admin-breadcrumbs";

export const dynamic = "force-dynamic";

export default function ContentExplorerPage() {
  const hubs = getHubs();

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <AdminBreadcrumbs />
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">Admin</p>
        <h1 className="text-2xl font-bold">Content Explorer</h1>
        <p className="text-slate-600">Browse hubs and jump into the right editor without guessing routes.</p>
      </header>

      <div className="grid gap-6">
        {hubs.map((hub) => {
          const nodes = getNodesForHub(hub.key);
          return (
            <section key={hub.key} className="rounded-2xl border border-brand-border bg-white p-6">
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">{hub.label}</h2>
                  {hub.description ? (
                    <p className="text-sm text-slate-600">{hub.description}</p>
                  ) : null}
                </div>
                <Link
                  href={`/admin/content/hubs/${hub.key}`}
                  className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  View hub
                </Link>
              </div>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {nodes.map((node) => (
                  <li key={node.key} className="rounded-xl border border-brand-border bg-slate-50 p-4">
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
            </section>
          );
        })}
      </div>
    </div>
  );
}
