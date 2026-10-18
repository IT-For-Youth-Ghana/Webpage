"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2, Plus, Save, Trash2 } from "lucide-react";

import type { CmsPublicSettings } from "@/lib/cms/settings";

type ApiResponse = { success?: boolean; message?: string };
type SubmitState = { type: "idle" | "success" | "error"; message: string };

type Props = { initial: CmsPublicSettings };

const input =
  "mt-2 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20";

export function SettingsForm({ initial }: Props) {
  const router = useRouter();
  const [values, setValues] = useState<CmsPublicSettings>(() => initial);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>({ type: "idle", message: "" });

  const update = <Key extends keyof CmsPublicSettings>(key: Key, value: CmsPublicSettings[Key]) => setValues((v) => ({ ...v, [key]: value }));
  const updateContact = (key: keyof CmsPublicSettings["contact"], value: string) => setValues((v) => ({ ...v, contact: { ...v.contact, [key]: value } }));
  const updateSocial = (i: number, key: "label" | "href" | "network", value: string) => setValues((v) => ({ ...v, socials: v.socials.map((s, idx) => (idx === i ? { ...s, [key]: value } : s)) }));
  const addSocial = () => setValues((v) => ({ ...v, socials: [...v.socials, { label: "", href: "", network: "" }] }));
  const removeSocial = (i: number) => setValues((v) => ({ ...v, socials: v.socials.filter((_, idx) => idx !== i) }));

  const onSave = async () => {
    setIsSubmitting(true);
    setSubmitState({ type: "idle", message: "" });
    try {
      const resp = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const payload = (await resp.json().catch(() => null)) as ApiResponse | null;
      if (!resp.ok || !payload?.success) {
        throw new Error(payload?.message || "We couldn't save settings.");
      }
      setSubmitState({ type: "success", message: payload.message || "Settings updated." });
      router.refresh();
    } catch (err) {
      setSubmitState({ type: "error", message: err instanceof Error ? err.message : "We couldn't save settings." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Site meta */}
      <section className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm lg:p-8">
        <h3 className="font-heading text-xl font-semibold text-brand-ink">Site metadata (optional)</h3>
        <div className="mt-4 grid gap-5 md:grid-cols-3">
          <div>
            <label className="text-sm font-bold text-brand-ink">Site title</label>
            <input className={input} value={values.siteTitle ?? ""} onChange={(e) => update("siteTitle", e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-bold text-brand-ink">Default description</label>
            <input className={input} value={values.siteDescription ?? ""} onChange={(e) => update("siteDescription", e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-bold text-brand-ink">Default OG image</label>
            <input className={input} value={values.defaultOgImage ?? ""} onChange={(e) => update("defaultOgImage", e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-bold text-brand-ink">Header logo URL</label>
            <input className={input} value={values.logoUrl ?? ""} onChange={(e) => update("logoUrl", e.target.value)} placeholder="/Asset-1.png" />
          </div>
        </div>
      </section>

      {submitState.type !== "idle" ? (
        <div className={`flex items-start gap-3 rounded-[24px] border p-5 text-sm font-medium ${submitState.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
          {submitState.type === "success" ? <CheckCircle2 className="mt-0.5 h-5 w-5" /> : <AlertCircle className="mt-0.5 h-5 w-5" />}
          <span>{submitState.message}</span>
        </div>
      ) : null}

      <section className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm lg:p-8">
        <h3 className="font-heading text-xl font-semibold text-brand-ink">Public contact</h3>
        <div className="mt-4 grid gap-5 md:grid-cols-3">
          <div>
            <label className="text-sm font-bold text-brand-ink">Email</label>
            <input className={input} value={values.contact.email ?? ""} onChange={(e) => updateContact("email", e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-bold text-brand-ink">Phone</label>
            <input className={input} value={values.contact.phone ?? ""} onChange={(e) => updateContact("phone", e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-bold text-brand-ink">Location</label>
            <input className={input} value={values.contact.location ?? ""} onChange={(e) => updateContact("location", e.target.value)} />
          </div>
        </div>
      </section>

      <section className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm lg:p-8">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-heading text-xl font-semibold text-brand-ink">Social links</h3>
          <button onClick={addSocial} type="button" className="inline-flex items-center gap-2 rounded-full border border-brand-border px-4 py-2 text-sm font-semibold text-brand-ink"><Plus className="h-4 w-4" /> Add social</button>
        </div>
        <div className="space-y-4">
          {values.socials.map((s, i) => (
            <div key={`${s.label}-${i}`} className="grid items-end gap-4 rounded-2xl border border-brand-border p-4 md:grid-cols-[1fr_1fr_1fr_auto]">
              <div>
                <label className="text-sm font-bold text-brand-ink">Label</label>
                <input className={input} value={s.label} onChange={(e) => updateSocial(i, "label", e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-bold text-brand-ink">Href</label>
                <input className={input} value={s.href} onChange={(e) => updateSocial(i, "href", e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-bold text-brand-ink">Network (optional)</label>
                <input className={input} value={s.network ?? ""} onChange={(e) => updateSocial(i, "network", e.target.value)} />
              </div>
              <button onClick={() => removeSocial(i)} type="button" className="h-10 rounded-xl border border-rose-200 px-3 text-sm font-semibold text-rose-700"><Trash2 className="mr-1 inline-block h-4 w-4" /> Remove</button>
            </div>
          ))}
        </div>
      </section>

      <div className="flex items-center gap-3 rounded-[26px] border border-brand-border bg-white px-5 py-4 shadow-sm">
        <button onClick={onSave} disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70">
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save settings
        </button>
      </div>
    </div>
  );
}
