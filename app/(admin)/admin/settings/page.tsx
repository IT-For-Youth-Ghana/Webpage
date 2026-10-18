import { Settings, Wrench } from "lucide-react";

import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatusPill } from "@/components/admin/admin-status-pill";
import { adminSettingsGroups } from "@/lib/cms/admin-config";
import { SettingsForm } from "@/components/admin/settings-form";
import { getCmsSettings } from "@/lib/cms/settings";
import type { AdminMetric } from "@/types/admin";

const settingsMetrics: AdminMetric[] = [
  {
    label: "Settings groups",
    value: String(adminSettingsGroups.length),
    description: "SEO, contact, Firebase, and integration groups are modeled.",
    status: "active",
  },
  {
    label: "Configured",
    value: String(adminSettingsGroups.filter((group) => group.status === "configured").length),
    description: "Groups with enough seed or env data to render safely.",
    status: "configured",
  },
  {
    label: "Needs env",
    value: String(adminSettingsGroups.filter((group) => group.status === "missing").length),
    description: "Groups waiting on credentials or production configuration.",
    status: "missing",
  },
];

export default async function AdminSettingsPage() {
  const cmsSettings = await getCmsSettings();
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Settings CMS"
        title="Site settings and integration readiness"
        description="A structured settings surface for SEO defaults, public contact information, Firebase configuration, Brevo notifications, and portal API wiring."
      />

      <div className="grid gap-5 md:grid-cols-3">
        {settingsMetrics.map((metric) => (
          <AdminMetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {adminSettingsGroups.map((group) => (
          <section
            key={group.id}
            className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 text-brand-accent">
                  <Settings className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-accent">
                    {group.id}
                  </p>
                  <h2 className="mt-2 font-heading text-2xl font-bold text-slate-950">
                    {group.label}
                  </h2>
                </div>
              </div>
              <AdminStatusPill status={group.status} />
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600">{group.description}</p>
          </section>
        ))}
      </div>

      {/* Editable public settings */}
      <section className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-brand-accent"><Wrench className="h-5 w-5" /></div>
          <div>
            <h3 className="font-heading text-xl font-semibold text-slate-950">Public settings</h3>
            <p className="text-sm leading-7 text-slate-600">Edit public contact details and social links used in the footer and contact page.</p>
          </div>
        </div>
        <SettingsForm initial={cmsSettings} />
      </section>
    </div>
  );
}
