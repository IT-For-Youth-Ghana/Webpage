"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowDown, ArrowUp, CheckCircle2, Loader2, Plus, Save, Trash2 } from "lucide-react";

import { MarqueeTicker } from "@/components/home/marquee-ticker";
import type { MarqueeTickerContent, MarqueeTickerItem, MarqueeTickerMode } from "@/components/home/marquee-ticker";

type ApiResponse = { success?: boolean; message?: string };
type SubmitState = { type: "idle" | "success" | "error"; message: string };

type Props = { initial: MarqueeTickerContent };

const input =
  "mt-2 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20";
const smallInput =
  "mt-2 w-56 rounded-2xl border border-brand-border bg-white px-3 py-2 text-sm text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20";

export function TickerForm({ initial }: Props) {
  const router = useRouter();
  const [values, setValues] = useState<MarqueeTickerContent>(() => initial);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>({ type: "idle", message: "" });

  const update = <Key extends keyof MarqueeTickerContent>(key: Key, value: MarqueeTickerContent[Key]) => setValues((v) => ({ ...v, [key]: value }));

  const addItem = () => setValues((v) => ({ ...v, items: [...v.items, { label: "", href: "" }] }));
  const removeItem = (i: number) => setValues((v) => ({ ...v, items: v.items.filter((_, idx) => idx !== i) }));
  const updateItem = <Key extends keyof MarqueeTickerItem>(i: number, key: Key, val: MarqueeTickerItem[Key]) =>
    setValues((v) => ({ ...v, items: v.items.map((it, idx) => (idx === i ? { ...it, [key]: val } : it)) }));
  const up = (i: number) => setValues((v) => (i <= 0 ? v : { ...v, items: ((n) => ([n[i - 1], n[i]] = [n[i]!, n[i - 1]!], n))([...v.items]) }));
  const down = (i: number) => setValues((v) => (i >= v.items.length - 1 ? v : { ...v, items: ((n) => ([n[i], n[i + 1]] = [n[i + 1]!, n[i]!], n))([...v.items]) }));

  const onSave = async () => {
    setIsSubmitting(true);
    setSubmitState({ type: "idle", message: "" });
    try {
      const resp = await fetch("/api/admin/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker: values }),
      });
      const payload = (await resp.json().catch(() => null)) as ApiResponse | null;
      if (!resp.ok || !payload?.success) {
        throw new Error(payload?.message || "We couldn't save the ticker.");
      }
      setSubmitState({ type: "success", message: payload.message || "Ticker updated." });
      router.refresh();
    } catch (err) {
      setSubmitState({ type: "error", message: err instanceof Error ? err.message : "We couldn't save the ticker." });
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
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="text-sm font-bold text-brand-ink">Mode</label>
            <select className={smallInput} value={values.mode} onChange={(e) => update("mode", e.target.value as MarqueeTickerMode)}>
              {(["stats","partners","news","announcement"] as MarqueeTickerMode[]).map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-bold text-brand-ink">Speed</label>
            <select className={smallInput} value={values.speed ?? "medium"} onChange={(e) => update("speed", e.target.value as MarqueeTickerContent["speed"])}>
              {(["slow","medium","fast"] as (NonNullable<MarqueeTickerContent["speed"]>)[]).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <label className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-brand-border bg-brand-mist px-4 py-3 text-sm font-medium text-brand-ink">
            <input type="checkbox" checked={values.pauseOnHover ?? false} onChange={(e) => update("pauseOnHover", e.target.checked)} className="h-4 w-4 rounded border-slate-300" />
            Pause on hover
          </label>
        </div>

        <button onClick={onSave} disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70">
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
        </button>
      </div>

      <div className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-heading text-lg font-semibold text-brand-ink">Items</h3>
          <button onClick={addItem} type="button" className="inline-flex items-center gap-2 rounded-full border border-brand-border px-4 py-2 text-sm font-semibold text-brand-ink"><Plus className="h-4 w-4" /> Add item</button>
        </div>

        <div className="space-y-4">
          {values.items.map((it, i) => (
            <div key={`${it.label}-${i}`} className="grid items-end gap-4 rounded-2xl border border-brand-border p-4 md:grid-cols-[1fr_1fr_1fr_auto_auto]">
              <div>
                <label className="text-sm font-bold text-brand-ink">Label</label>
                <input className={input} value={it.label} onChange={(e) => updateItem(i, "label", e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-bold text-brand-ink">Href (optional)</label>
                <input className={input} value={it.href ?? ""} onChange={(e) => updateItem(i, "href", e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-bold text-brand-ink">Type (optional)</label>
                <select
                  className={smallInput}
                  value={it.type ?? ""}
                  onChange={(e) => updateItem(i, "type", e.target.value ? (e.target.value as MarqueeTickerMode) : undefined)}
                >
                  <option value="">Any</option>
                  {(["stats","partners","news","announcement"] as MarqueeTickerMode[]).map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => up(i)} type="button" className="rounded-full border border-brand-border p-2 text-brand-ink"><ArrowUp className="h-4 w-4" /></button>
                <button onClick={() => down(i)} type="button" className="rounded-full border border-brand-border p-2 text-brand-ink"><ArrowDown className="h-4 w-4" /></button>
              </div>
              <button onClick={() => removeItem(i)} type="button" className="h-10 rounded-xl border border-rose-200 px-3 text-sm font-semibold text-rose-700"><Trash2 className="mr-1 inline-block h-4 w-4" /> Remove</button>
            </div>
          ))}
        </div>
      </div>

      {/* Live preview */}
      <section className="overflow-hidden rounded-[30px] border border-brand-border bg-gray-950">
        <div className="border-b border-white/10 p-4">
          <h4 className="text-sm font-semibold text-white">Preview</h4>
          <p className="mt-1 text-xs text-white/50">This simulates the marquee with the current values. Save to publish.</p>
        </div>
        <MarqueeTicker ticker={values} />
      </section>
    </div>
  );
}
