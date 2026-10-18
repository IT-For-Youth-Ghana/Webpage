"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2, Save } from "lucide-react";

type ApiResponse = { success?: boolean; message?: string; errors?: unknown };

type SubmitState = {
  type: "idle" | "success" | "error";
  message: string;
};

type JsonEditorProps = {
  title: string;
  description?: string;
  payloadKey: string; // key in homepage doc to set, e.g., "heroSlides"
  initialValue: unknown;
  pretty?: boolean;
};

const textareaClass =
  "mt-3 h-72 w-full rounded-2xl border border-brand-border bg-white p-4 font-mono text-[12px] leading-5 text-brand-ink outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20";

export function HomepageJsonEditor({ title, description, payloadKey, initialValue, pretty = true }: JsonEditorProps) {
  const router = useRouter();
  const [json, setJson] = useState<string>(() => {
    try {
      return pretty ? JSON.stringify(initialValue ?? {}, null, 2) : JSON.stringify(initialValue ?? {});
    } catch {
      return String(initialValue ?? "{}");
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>({ type: "idle", message: "" });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitState({ type: "idle", message: "" });

    let parsed: unknown = null;
    try {
      parsed = JSON.parse(json);
    } catch {
      setIsSubmitting(false);
      setSubmitState({ type: "error", message: "Invalid JSON. Please fix and try again." });
      return;
    }

    try {
      const resp = await fetch("/api/admin/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [payloadKey]: parsed }),
      });
      const payload = (await resp.json().catch(() => null)) as ApiResponse | null;
      if (!resp.ok || !payload?.success) {
        throw new Error(payload?.message || "We couldn't save this section.");
      }
      setSubmitState({ type: "success", message: payload.message || "Section updated." });
      router.refresh();
    } catch (err) {
      setSubmitState({ type: "error", message: err instanceof Error ? err.message : "We couldn't save this section." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm lg:p-8">
        <h3 className="font-heading text-xl font-semibold text-brand-ink">{title}</h3>
        {description ? (
          <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
        ) : null}
        <textarea className={textareaClass} value={json} onChange={(e) => setJson(e.target.value)} spellCheck={false} />
        <div className="mt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save section
          </button>
        </div>
      </div>

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
    </form>
  );
}
