import Link from "next/link";

import { AdminStatusPill } from "@/components/admin/admin-status-pill";
import type { AdminMetric } from "@/types/admin";

type AdminMetricCardProps = {
  metric: AdminMetric;
};

export function AdminMetricCard({ metric }: AdminMetricCardProps) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{metric.label}</p>
          <p className="mt-3 font-heading text-4xl font-bold text-slate-950">
            {metric.value}
          </p>
        </div>
        {metric.status ? <AdminStatusPill status={metric.status} /> : null}
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-600">{metric.description}</p>
      {metric.action ? (
        <div className="mt-5">
          <Link
            href={metric.action.href}
            className="inline-flex rounded-full border border-brand-border px-4 py-2 text-xs font-semibold text-brand-ink transition hover:bg-brand-mist"
          >
            {metric.action.label}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
