"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowDown, ArrowUp, CheckCircle2, Loader2, Plus, Save, Trash2 } from "lucide-react";

import type { ProgrammeShowcaseItem } from "@/components/home/programme-showcase";

type ApiResponse = { success?: boolean; message?: string };
type SubmitState = { type: "idle" | "success" | "error"; message: string };

type Props = { initial: ProgrammeShowcaseItem[] };

const input =
  "mt-2 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20";

export function ProgrammeShowcaseForm({ initial }: Props) {
  const router = useRouter();
  const [items, setItems] = useState<ProgrammeShowcaseItem[]>(() => initial);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>({ type: "idle", message: "" });

  const update = <Key extends keyof ProgrammeShowcaseItem>(i: number, key: Key, value: ProgrammeShowcaseItem[Key]) =>
    setItems((arr) => {
      const next = [...arr];
      next[i] = { ...next[i]!, [key]: value };
      return next;
    });

  const add = () =>
    setItems((arr) => [
      ...arr,
      {
        id: `showcase-${Date.now()}`,
        title: "",
        description: "",
        href: "/",
        image: "",
        accent: "#1E72BA",
        icon: "•",
        eyebrow: "",
        active: true,
      },
    ]);

  const remove = (i: number) => setItems((arr) => arr.filter((_, idx) => idx !== i));
  const up = (i: number) => setItems((arr) => (i <= 0 ? arr : ((n) => ([n[i - 1], n[i]] = [n[i]!, n[i - 1]!], n))([...arr])));
  const down = (i: number) => setItems((arr) => (i >= arr.length - 1 ? arr : ((n) => ([n[i], n[i + 1]] = [n[i + 1]!, n[i]!], n))([...arr])));

  const onSave = async () => {
    setIsSubmitting(true);
    setSubmitState({ type: "idle", message: "" });
    try {
      const resp = await fetch("/api/admin/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ programmeShowcase: items }),
      });
      const payload = (await resp.json().catch(() => null)) as ApiResponse | null;
      if (!resp.ok || !payload?.success) {
        throw new Error(payload?.message || "We couldn't save the showcase.");
      }
      setSubmitState({ type: "success", message: payload.message || "Showcase updated." });
      router.refresh();
    } catch (err) {
      setSubmitState({ type: "error", message: err instanceof Error ? err.message : "We couldn't save the showcase." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {submitState.type !== "idle" ? (
        <div className={`flex items-start gap-3 rounded-[24px] border p-5 text-sm font-medium ${submitState.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
          {submitState.type === "success" ? <CheckCircle2 className="mt-0.5 h-5 w-5" /> : <AlertCircle className="mt-0.5 h-5 w-5" />}
          <span>{submitState.message}</span>
        </div>
      ) : null}

      <div className="flex items-center justify-between">
        <button onClick={add} type="button" className="inline-flex items-center gap-2 rounded-full border border-brand-border px-4 py-2 text-sm font-semibold text-brand-ink">
          <Plus className="h-4 w-4" /> Add card
        </button>
        <button onClick={onSave} disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70">
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
        </button>
      </div>

      {items.map((item, i) => (
        <section key={item.id} className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-heading text-lg font-semibold text-brand-ink">Card {i + 1}</h3>
            <div className="flex items-center gap-2">
              <button onClick={() => up(i)} type="button" className="rounded-full border border-brand-border p-2 text-brand-ink"><ArrowUp className="h-4 w-4" /></button>
              <button onClick={() => down(i)} type="button" className="rounded-full border border-brand-border p-2 text-brand-ink"><ArrowDown className="h-4 w-4" /></button>
              <button onClick={() => remove(i)} type="button" className="rounded-full border border-rose-200 p-2 text-rose-700"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div><label className="text-sm font-bold text-brand-ink">ID</label><input className={input} value={item.id} onChange={(e) => update(i, "id", e.target.value)} /></div>
            <div><label className="text-sm font-bold text-brand-ink">Eyebrow</label><input className={input} value={item.eyebrow ?? ""} onChange={(e) => update(i, "eyebrow", e.target.value)} /></div>
            <div className="md:col-span-2"><label className="text-sm font-bold text-brand-ink">Title</label><input className={input} value={item.title} onChange={(e) => update(i, "title", e.target.value)} /></div>
            <div className="md:col-span-2"><label className="text-sm font-bold text-brand-ink">Description</label><input className={input} value={item.description} onChange={(e) => update(i, "description", e.target.value)} /></div>
            <div><label className="text-sm font-bold text-brand-ink">Href</label><input className={input} value={item.href} onChange={(e) => update(i, "href", e.target.value)} /></div>
            <div><label className="text-sm font-bold text-brand-ink">Image</label><input className={input} value={item.image} onChange={(e) => update(i, "image", e.target.value)} /></div>
            <div><label className="text-sm font-bold text-brand-ink">Accent color</label><input className={input} value={item.accent} onChange={(e) => update(i, "accent", e.target.value)} /></div>
            <div><label className="text-sm font-bold text-brand-ink">Icon (emoji or single char)</label><input className={input} value={item.icon ?? ""} onChange={(e) => update(i, "icon", e.target.value)} /></div>
            <label className="inline-flex items-center gap-3 rounded-2xl border border-brand-border bg-brand-mist px-4 py-3 text-sm font-medium text-brand-ink">
              <input type="checkbox" checked={item.active !== false} onChange={(e) => update(i, "active", e.target.checked)} className="h-4 w-4 rounded border-slate-300" /> Active
            </label>
          </div>
        </section>
      ))}
    </div>
  );
}
