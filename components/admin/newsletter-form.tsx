"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2, Save } from "lucide-react";

import type { NewsletterSignupContent } from "@/types/content";

type ApiResponse = { success?: boolean; message?: string };
type SubmitState = { type: "idle" | "success" | "error"; message: string };

type Props = { initial: NewsletterSignupContent };

const input =
  "mt-2 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20";

export function NewsletterForm({ initial }: Props) {
  const router = useRouter();
  const [values, setValues] = useState<NewsletterSignupContent>(() => initial);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>({ type: "idle", message: "" });

  const update = <Key extends keyof NewsletterSignupContent>(key: Key, value: NewsletterSignupContent[Key]) => setValues((v) => ({ ...v, [key]: value }));

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitState({ type: "idle", message: "" });
    try {
      const resp = await fetch("/api/admin/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newsletterSignup: values }),
      });
      const payload = (await resp.json().catch(() => null)) as ApiResponse | null;
      if (!resp.ok || !payload?.success) {
        throw new Error(payload?.message || "We couldn't save the newsletter config.");
      }
      setSubmitState({ type: "success", message: payload.message || "Newsletter section updated." });
      router.refresh();
    } catch (err) {
      setSubmitState({ type: "error", message: err instanceof Error ? err.message : "We couldn't save the newsletter config." });
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
          <h2 className="mt-2 font-heading text-2xl font-bold text-brand-ink">Newsletter signup</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="text-sm font-bold text-brand-ink">Eyebrow</label>
            <input className={input} value={values.eyebrow} onChange={(e) => update("eyebrow", e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-bold text-brand-ink">Heading</label>
            <input className={input} value={values.heading} onChange={(e) => update("heading", e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-bold text-brand-ink">Description</label>
            <textarea className={input + " h-24"} value={values.description} onChange={(e) => update("description", e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-bold text-brand-ink">Privacy note</label>
            <textarea className={input + " h-20"} value={values.privacyNote} onChange={(e) => update("privacyNote", e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-bold text-brand-ink">Interest tag</label>
            <input className={input} value={values.interest ?? ""} onChange={(e) => update("interest", e.target.value)} />
          </div>
          <label className="mt-2 inline-flex items-center gap-3 rounded-2xl border border-brand-border bg-brand-mist px-4 py-3 text-sm font-medium text-brand-ink">
            <input type="checkbox" checked={values.active !== false} onChange={(e) => update("active", e.target.checked)} className="h-4 w-4 rounded border-slate-300" />
            Active
          </label>
        </div>
      </section>

      <div className="flex items-center gap-3 rounded-[26px] border border-brand-border bg-white px-5 py-4 shadow-sm">
        <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-70">
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save newsletter
        </button>
      </div>
    </form>
  );
}
