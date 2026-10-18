import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { AdminStatusPill } from "@/components/admin/admin-status-pill";
import type { AdminCollectionDefinition } from "@/types/admin";

type AdminCollectionGridProps = {
  collections: AdminCollectionDefinition[];
};

export function AdminCollectionGrid({ collections }: AdminCollectionGridProps) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {collections.map((collection) => (
        <Link
          key={collection.key}
          href={collection.route}
          className="group rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-panel"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-accent">
                {collection.collection}
              </p>
              <h2 className="mt-3 font-heading text-2xl font-bold text-slate-950">
                {collection.label}
              </h2>
            </div>
            <AdminStatusPill status={collection.status} />
          </div>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            {collection.description}
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold text-slate-500">Docs</p>
              <p className="mt-1 font-heading text-2xl font-bold text-slate-950">
                {collection.documentCount}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold text-slate-500">Read</p>
              <p className="mt-1 text-sm font-bold text-slate-800">
                {collection.readModel}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold text-slate-500">Writes</p>
              <p className="mt-1 text-sm font-bold text-slate-800">
                {collection.writeRole}
              </p>
            </div>
          </div>

          <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-deep">
            Open collection
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      ))}
    </div>
  );
}
