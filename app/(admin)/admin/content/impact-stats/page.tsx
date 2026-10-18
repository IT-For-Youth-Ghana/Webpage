import { ChartNoAxesColumn } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { getCmsImpactStats } from "@/lib/cms/impact-stats";

export const dynamic = "force-dynamic";

export default async function AdminImpactStatsPage() {
  const stats = await getCmsImpactStats();

  async function updateStats(formData: FormData) {
    "use server";
    const raw = formData.get("stats-json");
    try {
      const parsed = JSON.parse(String(raw ?? "[]"));
      await fetch(process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/impact-stats` : "/api/admin/impact-stats", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stats: parsed }),
      });
    } catch {
      // no-op; rely on client page refresh to show updated content on success
    }
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Homepage CMS"
        title="Impact statistics"
        description="Edit the highlight stats used on the homepage and across hub pages."
        icon={<ChartNoAxesColumn className="h-5 w-5" />}
      />

      <form action={updateStats} className="space-y-4">
        <section className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm lg:p-8">
          <h3 className="font-heading text-xl font-semibold text-brand-ink">Stats JSON</h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">Array of objects: value, label, optional description and icon.</p>
          <textarea
            name="stats-json"
            defaultValue={JSON.stringify(stats, null, 2)}
            spellCheck={false}
            className="mt-3 h-72 w-full rounded-2xl border border-brand-border bg-white p-4 font-mono text-[12px] leading-5 text-brand-ink outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20"
          />
          <div className="mt-4">
            <button type="submit" className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white">Save stats</button>
          </div>
        </section>
      </form>
    </div>
  );
}
