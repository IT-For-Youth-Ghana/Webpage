import Image from "next/image";
import { Copy, FolderOpen, Upload } from "lucide-react";

import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatusPill } from "@/components/admin/admin-status-pill";
import { adminMediaFolders } from "@/lib/cms/admin-config";
import type { AdminMetric } from "@/types/admin";

const mediaMetrics: AdminMetric[] = [
  {
    label: "Storage folders",
    value: String(adminMediaFolders.length),
    description: "Folder model matches the Firebase Storage browser planned for CMS.",
    status: "active",
  },
  {
    label: "Seeded assets",
    value: String(adminMediaFolders.reduce((total, folder) => total + folder.itemCount, 0)),
    description: "Representative local assets currently feeding public pages.",
    status: "published",
  },
  {
    label: "Upload workflow",
    value: "Pending",
    description: "Drag-drop uploads will activate with Firebase Storage credentials.",
    status: "missing",
  },
];

function isImageAsset(asset: string) {
  return /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(asset);
}

export default function AdminMediaPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Media CMS"
        title="Firebase Storage browser foundation"
        description="A folder-based media library scaffold for initiatives, team profiles, news, logos, and documents. Upload, rename, delete, and copy-URL actions can wire into Firebase Storage from this structure."
      />

      <div className="grid gap-5 md:grid-cols-3">
        {mediaMetrics.map((metric) => (
          <AdminMetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {adminMediaFolders.map((folder) => (
          <section
            key={folder.id}
            className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 text-brand-accent">
                  <FolderOpen className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-accent">
                    /{folder.storagePath}
                  </p>
                  <h2 className="mt-2 font-heading text-2xl font-bold text-slate-950">
                    {folder.label}
                  </h2>
                </div>
              </div>
              <AdminStatusPill status="needs-firebase" label={`${folder.itemCount} assets`} />
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-600">{folder.description}</p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {folder.sampleAssets.map((asset) => (
                <div
                  key={asset}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                >
                  {isImageAsset(asset) ? (
                    <div className="relative h-40 bg-slate-100">
                      <Image
                        src={asset}
                        alt={`${folder.label} sample asset`}
                        fill
                        sizes="(max-width: 768px) 100vw, 300px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-40 items-center justify-center bg-slate-100 px-4 text-center text-sm font-bold text-slate-600">
                      Document asset
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-3 px-4 py-3">
                    <p className="truncate text-sm font-semibold text-slate-700">{asset}</p>
                    <button
                      type="button"
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm"
                      aria-label={`Copy ${asset}`}
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-bold text-white"
            >
              <Upload className="h-4 w-4" />
              Upload scaffold
            </button>
          </section>
        ))}
      </div>
    </div>
  );
}
