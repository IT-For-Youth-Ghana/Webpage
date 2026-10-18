"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2, Save } from "lucide-react";

import type { DonationCampaignContent } from "@/types/content";

type ApiResponse = { success?: boolean; message?: string };
type SubmitState = { type: "idle" | "success" | "error"; message: string };

type Props = { initial: DonationCampaignContent };

const input =
  "mt-2 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20";
const numberInput =
  "mt-2 w-40 rounded-2xl border border-brand-border bg-white px-3 py-2 text-sm text-brand-ink outline-none transition focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20";

export function DonationCampaignForm({ initial }: Props) {
  const router = useRouter();
  const [values, setValues] = useState<DonationCampaignContent>(() => initial);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>({ type: "idle", message: "" });

  const update = <Key extends keyof DonationCampaignContent>(
    key: Key,
    value: DonationCampaignContent[Key],
  ) => {
    setValues((v) => ({ ...v, [key]: value }));
  };

  const updateArray = (key: "supportPoints", csv: string) => {
    const arr = csv
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    setValues((v) => ({ ...v, [key]: arr }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitState({ type: "idle", message: "" });
    try {
      const resp = await fetch("/api/admin/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donationCampaign: values }),
      });
      const payload = (await resp.json().catch(() => null)) as ApiResponse | null;
      if (!resp.ok || !payload?.success) {
        throw new Error(payload?.message || "We couldn't save the campaign.");
      }
      setSubmitState({ type: "success", message: payload.message || "Donation campaign updated." });
      router.refresh();
    } catch (err) {
      setSubmitState({ type: "error", message: err instanceof Error ? err.message : "We couldn't save the campaign." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {submitState.type !== "idle" ? (
        <div
          className={`flex items-start gap-3 rounded-[24px] border p-5 text-sm font-medium ${
            submitState.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          {submitState.type === "success" ? <CheckCircle2 className="mt-0.5 h-5 w-5" /> : <AlertCircle className="mt-0.5 h-5 w-5" />}
          <span>{submitState.message}</span>
        </div>
      ) : null}

      <section className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm lg:p-8">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-accent">Homepage</p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-brand-ink">Donation campaign</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="text-sm font-bold text-brand-ink">Eyebrow / badge</label>
            <input className={input} value={values.eyebrow} onChange={(e) => update("eyebrow", e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-bold text-brand-ink">Headline</label>
            <input className={input} value={values.headline} onChange={(e) => update("headline", e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-bold text-brand-ink">Description (optional)</label>
            <textarea className={input + " h-28"} value={values.description} onChange={(e) => update("description", e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-bold text-brand-ink">Image URL</label>
            <input className={input} value={values.image} onChange={(e) => update("image", e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-bold text-brand-ink">Currency</label>
            <input className={input} value={values.currency} onChange={(e) => update("currency", e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-bold text-brand-ink">Goal amount</label>
            <input className={numberInput} type="number" value={values.goalAmount} onChange={(e) => update("goalAmount", Number(e.target.value))} />
          </div>
          <div>
            <label className="text-sm font-bold text-brand-ink">Raised amount</label>
            <input className={numberInput} type="number" value={values.raisedAmount} onChange={(e) => update("raisedAmount", Number(e.target.value))} />
          </div>
          <div>
            <label className="text-sm font-bold text-brand-ink">Donor count</label>
            <input className={numberInput} type="number" value={values.donorCount} onChange={(e) => update("donorCount", Number(e.target.value))} />
          </div>
          <div>
            <label className="text-sm font-bold text-brand-ink">Deadline (ISO)</label>
            <input className={input} value={values.deadline} onChange={(e) => update("deadline", e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-bold text-brand-ink">Support points (one per line)</label>
            <textarea className={input + " h-28"} value={(values.supportPoints ?? []).join("\n")} onChange={(e) => updateArray("supportPoints", e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-bold text-brand-ink">Primary CTA label</label>
            <input className={input} value={values.primaryCta.label} onChange={(e) => update("primaryCta", { ...values.primaryCta, label: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-bold text-brand-ink">Primary CTA href</label>
            <input className={input} value={values.primaryCta.href} onChange={(e) => update("primaryCta", { ...values.primaryCta, href: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-bold text-brand-ink">Secondary CTA label</label>
            <input className={input} value={values.secondaryCta?.label ?? ""} onChange={(e) => update("secondaryCta", { ...(values.secondaryCta ?? { label: "", href: "" }), label: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-bold text-brand-ink">Secondary CTA href</label>
            <input className={input} value={values.secondaryCta?.href ?? ""} onChange={(e) => update("secondaryCta", { ...(values.secondaryCta ?? { label: "", href: "" }), href: e.target.value })} />
          </div>
        </div>
      </section>

      <div className="flex items-center gap-3 rounded-[26px] border border-brand-border bg-white px-5 py-4 shadow-sm">
        <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-70">
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save campaign
        </button>
      </div>
    </form>
  );
}
