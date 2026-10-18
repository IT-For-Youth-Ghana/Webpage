"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2, Save } from "lucide-react";

import type { FeaturedStoryContent } from "@/components/home/featured-story-video";

type ApiResponse = { success?: boolean; message?: string };
type SubmitState = { type: "idle" | "success" | "error"; message: string };

type Props = { initial: FeaturedStoryContent };

const input =
  "mt-2 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20";

export function FeaturedStoryForm({ initial }: Props) {
  const router = useRouter();
  const [values, setValues] = useState<FeaturedStoryContent>(() => initial);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>({ type: "idle", message: "" });

  const update = <Key extends keyof FeaturedStoryContent>(key: Key, value: FeaturedStoryContent[Key]) => setValues((v) => ({ ...v, [key]: value }));
  const updateSecondary = (key: "label" | "href", value: string) => setValues((v) => ({ ...v, secondaryCta: { ...(v.secondaryCta ?? {}), [key]: value } }));

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitState({ type: "idle", message: "" });
    try {
      const resp = await fetch("/api/admin/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featuredStory: values }),
      });
      const payload = (await resp.json().catch(() => null)) as ApiResponse | null;
      if (!resp.ok || !payload?.success) {
        throw new Error(payload?.message || "We couldn't save the featured story.");
      }
      setSubmitState({ type: "success", message: payload.message || "Featured story updated." });
      router.refresh();
    } catch (err) {
      setSubmitState({ type: "error", message: err instanceof Error ? err.message : "We couldn't save the featured story." });
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
          <h2 className="mt-2 font-heading text-2xl font-bold text-brand-ink">Featured story / video</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="text-sm font-bold text-brand-ink">ID</label>
            <input className={input} value={values.id} onChange={(e) => update("id", e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-bold text-brand-ink">Label</label>
            <input className={input} value={values.label} onChange={(e) => update("label", e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-bold text-brand-ink">Headline</label>
            <input className={input} value={values.headline} onChange={(e) => update("headline", e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-bold text-brand-ink">Quote</label>
            <input className={input} value={values.quote} onChange={(e) => update("quote", e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-bold text-brand-ink">Name</label>
            <input className={input} value={values.name} onChange={(e) => update("name", e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-bold text-brand-ink">Role</label>
            <input className={input} value={values.role} onChange={(e) => update("role", e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-bold text-brand-ink">Programme</label>
            <input className={input} value={values.programme} onChange={(e) => update("programme", e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-bold text-brand-ink">Background image</label>
            <input className={input} value={values.backgroundImage} onChange={(e) => update("backgroundImage", e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-bold text-brand-ink">Video URL</label>
            <input className={input} value={values.videoUrl ?? ""} onChange={(e) => update("videoUrl", e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-bold text-brand-ink">Primary CTA label</label>
            <input className={input} value={values.primaryCtaLabel} onChange={(e) => update("primaryCtaLabel", e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-bold text-brand-ink">Secondary CTA label</label>
            <input className={input} value={values.secondaryCta.label} onChange={(e) => updateSecondary("label", e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-bold text-brand-ink">Secondary CTA href</label>
            <input className={input} value={values.secondaryCta.href} onChange={(e) => updateSecondary("href", e.target.value)} />
          </div>
        </div>
      </section>

      <div className="flex items-center gap-3 rounded-[26px] border border-brand-border bg-white px-5 py-4 shadow-sm">
        <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-70">
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save featured story
        </button>
      </div>
    </form>
  );
}
