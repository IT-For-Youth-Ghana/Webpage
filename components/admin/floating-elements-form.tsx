"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2, Save } from "lucide-react";

import type { FloatingElementsContent } from "@/components/layout/floating-elements";

type ApiResponse = {
  success?: boolean;
  message?: string;
};

type SubmitState = {
  type: "idle" | "success" | "error";
  message: string;
};

type Props = { initial: FloatingElementsContent };

const inputClass =
  "mt-2 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20";

const smallInput =
  "mt-2 w-32 rounded-2xl border border-brand-border bg-white px-3 py-2 text-sm text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20";

export function FloatingElementsForm({ initial }: Props) {
  const router = useRouter();
  const [values, setValues] = useState<FloatingElementsContent>(() => initial);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>({ type: "idle", message: "" });

  const update = (path: string, value: unknown) => {
    setValues((prev) => {
      const clone = { ...prev };
      const parts = path.split(".");
      let cursor = clone as unknown as Record<string, unknown>;
      for (let i = 0; i < parts.length - 1; i++) {
        const key = parts[i]!;
        const nextValue = cursor[key];
        cursor[key] =
          nextValue && typeof nextValue === "object" && !Array.isArray(nextValue)
            ? { ...(nextValue as Record<string, unknown>) }
            : {};
        cursor = cursor[key] as Record<string, unknown>;
      }
      cursor[parts[parts.length - 1]!] = value;
      return clone;
    });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitState({ type: "idle", message: "" });
    try {
      const resp = await fetch("/api/admin/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ floatingElements: values }),
      });
      const payload = (await resp.json().catch(() => null)) as ApiResponse | null;
      if (!resp.ok || !payload?.success) {
        throw new Error(payload?.message || "We couldn't save floating elements.");
      }
      setSubmitState({ type: "success", message: payload.message || "Floating elements updated." });
      router.refresh();
    } catch (err) {
      setSubmitState({
        type: "error",
        message: err instanceof Error ? err.message : "We couldn't save floating elements.",
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
          <h2 className="mt-2 font-heading text-2xl font-bold text-brand-ink">Floating elements</h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="font-heading text-lg font-semibold text-brand-ink">Donate button</h3>
            <label className="mt-3 block text-sm font-bold text-brand-ink">Label</label>
            <input className={inputClass} value={values.donateButton.label} onChange={(e) => update("donateButton.label", e.target.value)} />
            <label className="mt-4 block text-sm font-bold text-brand-ink">Href</label>
            <input className={inputClass} value={values.donateButton.href} onChange={(e) => update("donateButton.href", e.target.value)} />
            <div className="mt-4 flex items-center gap-4">
              <div>
                <label className="text-sm font-bold text-brand-ink">Show after px</label>
                <input className={smallInput} type="number" value={values.donateButton.showAfterPx} onChange={(e) => update("donateButton.showAfterPx", Number(e.target.value))} />
              </div>
              <label className="inline-flex items-center gap-3 rounded-2xl border border-brand-border bg-brand-mist px-4 py-3 text-sm font-medium text-brand-ink">
                <input type="checkbox" checked={values.donateButton.active} onChange={(e) => update("donateButton.active", e.target.checked)} className="h-4 w-4 rounded border-slate-300" />
                Active
              </label>
            </div>
          </div>

          <div>
            <h3 className="font-heading text-lg font-semibold text-brand-ink">Scroll to top</h3>
            <label className="mt-3 block text-sm font-bold text-brand-ink">Aria label</label>
            <input className={inputClass} value={values.scrollToTop.ariaLabel} onChange={(e) => update("scrollToTop.ariaLabel", e.target.value)} />
            <div className="mt-4 flex items-center gap-4">
              <div>
                <label className="text-sm font-bold text-brand-ink">Show after px</label>
                <input className={smallInput} type="number" value={values.scrollToTop.showAfterPx} onChange={(e) => update("scrollToTop.showAfterPx", Number(e.target.value))} />
              </div>
              <label className="inline-flex items-center gap-3 rounded-2xl border border-brand-border bg-brand-mist px-4 py-3 text-sm font-medium text-brand-ink">
                <input type="checkbox" checked={values.scrollToTop.active} onChange={(e) => update("scrollToTop.active", e.target.checked)} className="h-4 w-4 rounded border-slate-300" />
                Active
              </label>
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-heading text-lg font-semibold text-brand-ink">Exit intent</h3>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-sm font-bold text-brand-ink">ID</label>
                <input className={inputClass} value={values.exitIntent.id} onChange={(e) => update("exitIntent.id", e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-bold text-brand-ink">Mode</label>
                <select className={inputClass} value={values.exitIntent.mode} onChange={(e) => update("exitIntent.mode", e.target.value)}>
                  {(["newsletter","donate","announcement"] as (typeof values.exitIntent.mode)[]).map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-bold text-brand-ink">Headline</label>
                <input className={inputClass} value={values.exitIntent.headline} onChange={(e) => update("exitIntent.headline", e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-bold text-brand-ink">Description</label>
                <input className={inputClass} value={values.exitIntent.description} onChange={(e) => update("exitIntent.description", e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-bold text-brand-ink">Image</label>
                <input className={inputClass} value={values.exitIntent.image ?? ""} onChange={(e) => update("exitIntent.image", e.target.value)} />
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <label className="text-sm font-bold text-brand-ink">Delay ms</label>
                  <input className={smallInput} type="number" value={values.exitIntent.delayMs} onChange={(e) => update("exitIntent.delayMs", Number(e.target.value))} />
                </div>
                <div>
                  <label className="text-sm font-bold text-brand-ink">Dismiss days</label>
                  <input className={smallInput} type="number" value={values.exitIntent.dismissDays} onChange={(e) => update("exitIntent.dismissDays", Number(e.target.value))} />
                </div>
                <label className="inline-flex items-center gap-3 rounded-2xl border border-brand-border bg-brand-mist px-4 py-3 text-sm font-medium text-brand-ink">
                  <input type="checkbox" checked={values.exitIntent.active} onChange={(e) => update("exitIntent.active", e.target.checked)} className="h-4 w-4 rounded border-slate-300" />
                  Active
                </label>
              </div>
              <div>
                <label className="text-sm font-bold text-brand-ink">Newsletter interest tag</label>
                <input className={inputClass} value={values.exitIntent.newsletterInterest ?? ""} onChange={(e) => update("exitIntent.newsletterInterest", e.target.value)} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="flex items-center gap-3 rounded-[26px] border border-brand-border bg-white px-5 py-4 shadow-sm">
        <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-70">
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save floating elements
        </button>
      </div>
    </form>
  );
}
