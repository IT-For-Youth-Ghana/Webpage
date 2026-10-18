"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowDown, ArrowUp, CheckCircle2, Loader2, Plus, Save, Trash2 } from "lucide-react";

import type { JoinCtaCard } from "@/types/content";

type ApiResponse = { success?: boolean; message?: string };
type SubmitState = { type: "idle" | "success" | "error"; message: string };
type Props = { initial: JoinCtaCard[] };

const input =
  "mt-2 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20";

export function JoinCtaCardsForm({ initial }: Props) {
  const router = useRouter();
  const [cards, setCards] = useState<JoinCtaCard[]>(() => initial);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>({ type: "idle", message: "" });

  const update = <Key extends keyof JoinCtaCard>(i: number, key: Key, value: JoinCtaCard[Key]) =>
    setCards((arr) => {
      const next = [...arr];
      next[i] = { ...next[i]!, [key]: value };
      return next;
    });

  const add = () =>
    setCards((arr) => [
      ...arr,
      {
        id: `cta-${Date.now()}`,
        eyebrow: "",
        title: "",
        description: "",
        href: "/",
        buttonLabel: "Learn more",
        icon: "students",
        active: true,
      },
    ]);

  const remove = (i: number) => setCards((arr) => arr.filter((_, idx) => idx !== i));
  const up = (i: number) => setCards((arr) => (i <= 0 ? arr : ((n) => ([n[i - 1], n[i]] = [n[i]!, n[i - 1]!], n))([...arr])));
  const down = (i: number) => setCards((arr) => (i >= arr.length - 1 ? arr : ((n) => ([n[i], n[i + 1]] = [n[i + 1]!, n[i]!], n))([...arr])));

  const onSave = async () => {
    setIsSubmitting(true);
    setSubmitState({ type: "idle", message: "" });
    try {
      const resp = await fetch("/api/admin/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ joinCtaCards: cards }),
      });
      const payload = (await resp.json().catch(() => null)) as ApiResponse | null;
      if (!resp.ok || !payload?.success) {
        throw new Error(payload?.message || "We couldn't save the CTA cards.");
      }
      setSubmitState({ type: "success", message: payload.message || "CTA cards updated." });
      router.refresh();
    } catch (err) {
      setSubmitState({ type: "error", message: err instanceof Error ? err.message : "We couldn't save the CTA cards." });
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

      {cards.map((card, i) => (
        <section key={card.id} className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-heading text-lg font-semibold text-brand-ink">Card {i + 1}</h3>
            <div className="flex items-center gap-2">
              <button onClick={() => up(i)} type="button" className="rounded-full border border-brand-border p-2 text-brand-ink"><ArrowUp className="h-4 w-4" /></button>
              <button onClick={() => down(i)} type="button" className="rounded-full border border-brand-border p-2 text-brand-ink"><ArrowDown className="h-4 w-4" /></button>
              <button onClick={() => remove(i)} type="button" className="rounded-full border border-rose-200 p-2 text-rose-700"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div><label className="text-sm font-bold text-brand-ink">ID</label><input className={input} value={card.id} onChange={(e) => update(i, "id", e.target.value)} /></div>
            <div><label className="text-sm font-bold text-brand-ink">Icon</label>
              <select className={input} value={card.icon} onChange={(e) => update(i, "icon", e.target.value as JoinCtaCard["icon"])}>
                {(["students","organisations","volunteer"] as JoinCtaCard["icon"][]).map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div><label className="text-sm font-bold text-brand-ink">Eyebrow</label><input className={input} value={card.eyebrow} onChange={(e) => update(i, "eyebrow", e.target.value)} /></div>
            <div className="md:col-span-2"><label className="text-sm font-bold text-brand-ink">Title</label><input className={input} value={card.title} onChange={(e) => update(i, "title", e.target.value)} /></div>
            <div className="md:col-span-2"><label className="text-sm font-bold text-brand-ink">Description</label><input className={input} value={card.description} onChange={(e) => update(i, "description", e.target.value)} /></div>
            <div><label className="text-sm font-bold text-brand-ink">Href</label><input className={input} value={card.href} onChange={(e) => update(i, "href", e.target.value)} /></div>
            <div><label className="text-sm font-bold text-brand-ink">Button label</label><input className={input} value={card.buttonLabel} onChange={(e) => update(i, "buttonLabel", e.target.value)} /></div>
            <div><label className="text-sm font-bold text-brand-ink">Circular image URL</label><input className={input} value={card.image ?? ""} onChange={(e) => update(i, "image", e.target.value)} placeholder="/images/randomPictures/UXcours.jpg" /></div>
            <div className="md:col-span-2"><label className="text-sm font-bold text-brand-ink">Circular image alt text</label><input className={input} value={card.imageAlt ?? ""} onChange={(e) => update(i, "imageAlt", e.target.value)} placeholder="What is happening in the photograph" /></div>
            <label className="inline-flex items-center gap-3 rounded-2xl border border-brand-border bg-brand-mist px-4 py-3 text-sm font-medium text-brand-ink">
              <input type="checkbox" checked={card.active !== false} onChange={(e) => update(i, "active", e.target.checked)} className="h-4 w-4 rounded border-slate-300" /> Active
            </label>
          </div>
        </section>
      ))}
    </div>
  );
}
