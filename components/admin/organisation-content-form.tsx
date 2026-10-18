"use client";

import { FormEvent, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Save } from "lucide-react";

import type { OrganisationOverviewContent, OrganisationServicePage } from "@/types/content";

type Props =
  | { kind: "overview"; initial: OrganisationOverviewContent }
  | { kind: "service"; initial: OrganisationServicePage };

export function OrganisationContentForm({ kind, initial }: Props) {
  const [json, setJson] = useState(() => JSON.stringify(initial, null, 2));
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      const payload = JSON.parse(json) as OrganisationOverviewContent | OrganisationServicePage;
      const endpoint = kind === "overview" ? "/api/admin/organisations/overview" : `/api/admin/organisations/${(initial as OrganisationServicePage).slug}`;
      const response = await fetch(endpoint, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const body = (await response.json().catch(() => null)) as { message?: string } | null;
      if (!response.ok) throw new Error(body?.message || "The page could not be saved.");
      setStatus({ ok: true, message: body?.message || "Page saved." });
    } catch (error) {
      setStatus({ ok: false, message: error instanceof Error ? error.message : "Check that the JSON is valid." });
    } finally {
      setSaving(false);
    }
  }

  return <form onSubmit={submit} className="space-y-5">
    <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
      Every public section is represented below. Remove an item from an array to remove its card; use an empty array to hide the entire section. Images accept URL or public-path strings only—there is no upload field.
    </div>
    {status ? <div className={`flex gap-3 rounded-[22px] border p-4 text-sm ${status.ok ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-700"}`}>{status.ok ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}{status.message}</div> : null}
    <textarea aria-label="Complete page content JSON" spellCheck={false} value={json} onChange={(event) => setJson(event.target.value)} className="min-h-[70vh] w-full rounded-[28px] border border-brand-border bg-slate-950 p-6 font-mono text-sm leading-6 text-slate-100 outline-none focus:border-brand-accent" />
    <button disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white disabled:opacity-60">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Save complete page</button>
  </form>;
}
