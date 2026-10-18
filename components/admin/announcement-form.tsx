"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2, Save } from "lucide-react";

import type { Announcement } from "@/components/layout/announcement-bar";

type ApiResponse = {
  success?: boolean;
  message?: string;
  errors?: { fieldErrors?: Record<string, string[]> };
};

type SubmitState = {
  type: "idle" | "success" | "error";
  message: string;
};

type AnnouncementFormProps = {
  initial: Announcement;
};

const inputClass =
  "mt-2 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20";

export function AnnouncementForm({ initial }: AnnouncementFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<Announcement>(() => initial);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>({ type: "idle", message: "" });

  const update = <Key extends keyof Announcement>(key: Key, value: Announcement[Key]) => {
    setValues((v) => ({ ...v, [key]: value }));
  };

  const updateCta = (key: "label" | "href", value: string) => {
    setValues((v) => ({
      ...v,
      cta: { ...(v.cta ?? { label: "", href: "" }), [key]: value },
    }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitState({ type: "idle", message: "" });

    try {
      const resp = await fetch("/api/admin/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ announcement: values }),
      });
      const payload = (await resp.json().catch(() => null)) as ApiResponse | null;
      if (!resp.ok || !payload?.success) {
        throw new Error(payload?.message || "We couldn't save the announcement.");
      }
      setSubmitState({ type: "success", message: payload.message || "Announcement updated." });
      router.refresh();
    } catch (err) {
      setSubmitState({
        type: "error",
        message: err instanceof Error ? err.message : "We couldn't save the announcement.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {submitState.type !== "idle" ? (
        <div
          className={`flex items-start gap-3 rounded-[24px] border p-5 text-sm font-medium ${
            submitState.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          {submitState.type === "success" ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5" />
          ) : (
            <AlertCircle className="mt-0.5 h-5 w-5" />
          )}
          <span>{submitState.message}</span>
        </div>
      ) : null}

      <section className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm lg:p-8">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-accent">Homepage</p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-brand-ink">Announcement banner</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="label" className="text-sm font-bold text-brand-ink">Label</label>
            <input id="label" value={values.label} onChange={(e) => update("label", e.target.value)} className={inputClass} placeholder="Cohort 7 open" />
          </div>
          <div>
            <label htmlFor="variant" className="text-sm font-bold text-brand-ink">Variant</label>
            <select id="variant" value={values.variant} onChange={(e) => update("variant", e.target.value as Announcement["variant"])} className={inputClass}>
              {(["info","success","urgent","alert"] as Announcement["variant"][]).map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="message" className="text-sm font-bold text-brand-ink">Message</label>
            <input id="message" value={values.message} onChange={(e) => update("message", e.target.value)} className={inputClass} placeholder="Applications close 31 May 2026…" />
          </div>
          <div>
            <label htmlFor="ctaLabel" className="text-sm font-bold text-brand-ink">CTA label</label>
            <input id="ctaLabel" value={values.cta?.label ?? ""} onChange={(e) => updateCta("label", e.target.value)} className={inputClass} placeholder="Apply now" />
          </div>
          <div>
            <label htmlFor="ctaHref" className="text-sm font-bold text-brand-ink">CTA href</label>
            <input id="ctaHref" value={values.cta?.href ?? ""} onChange={(e) => updateCta("href", e.target.value)} className={inputClass} placeholder="/apply-for-training/courses" />
          </div>
          <div>
            <label htmlFor="start" className="text-sm font-bold text-brand-ink">Start ISO</label>
            <input id="start" value={values.startDate ?? ""} onChange={(e) => update("startDate", e.target.value)} className={inputClass} placeholder="2026-04-18T00:00:00.000Z" />
          </div>
          <div>
            <label htmlFor="end" className="text-sm font-bold text-brand-ink">End ISO</label>
            <input id="end" value={values.endDate ?? ""} onChange={(e) => update("endDate", e.target.value)} className={inputClass} placeholder="2026-05-31T23:59:59.000Z" />
          </div>
          <div>
            <label htmlFor="countdown" className="text-sm font-bold text-brand-ink">Countdown ISO</label>
            <input id="countdown" value={values.countdownDate ?? ""} onChange={(e) => update("countdownDate", e.target.value)} className={inputClass} placeholder="2026-05-31T23:59:59.000Z" />
          </div>
          <label className="mt-4 inline-flex items-center gap-3 rounded-2xl border border-brand-border bg-brand-mist px-4 py-3 text-sm font-medium text-brand-ink">
            <input type="checkbox" checked={values.dismissible ?? true} onChange={(e) => update("dismissible", e.target.checked)} className="h-4 w-4 rounded border-slate-300" />
            Dismissible
          </label>
        </div>
      </section>

      <div className="flex items-center gap-3 rounded-[26px] border border-brand-border bg-white px-5 py-4 shadow-sm">
        <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-70">
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save announcement
        </button>
      </div>
    </form>
  );
}
