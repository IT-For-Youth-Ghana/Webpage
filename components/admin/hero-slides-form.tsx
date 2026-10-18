"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowDown, ArrowUp, CheckCircle2, Loader2, Plus, Save, Trash2 } from "lucide-react";

import type { HeroSlide } from "@/types/content";

type ApiResponse = { success?: boolean; message?: string };

type SubmitState = { type: "idle" | "success" | "error"; message: string };

type Props = { initial: HeroSlide[] };

const input =
  "mt-2 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20";

export function HeroSlidesForm({ initial }: Props) {
  const router = useRouter();
  const [slides, setSlides] = useState<HeroSlide[]>(() => initial);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>({ type: "idle", message: "" });

  const update = <Key extends keyof HeroSlide>(index: number, key: Key, value: HeroSlide[Key]) => {
    setSlides((arr) => {
      const next = [...arr];
      next[index] = { ...next[index]!, [key]: value };
      return next;
    });
  };

  const updateCta = (index: number, which: "primary" | "secondary", key: "label" | "href", value: string) => {
    setSlides((arr) => {
      const next = [...arr];
      const slide = { ...next[index]! } as HeroSlide;
      slide.cta = slide.cta || { primary: { label: "", href: "" } };
      if (which === "primary") {
        slide.cta.primary = { ...slide.cta.primary, [key]: value };
      } else {
        slide.cta.secondary = { ...(slide.cta.secondary ?? { label: "", href: "" }), [key]: value };
      }
      next[index] = slide;
      return next;
    });
  };

  const addSlide = () => {
    const newSlide: HeroSlide = {
      id: `slide-${Date.now()}`,
      eyebrow: "",
      heading: "",
      body: "",
      image: "",
      overlayFrom: "rgba(10,15,40,0.88)",
      overlayTo: "rgba(10,15,40,0.35)",
      accent: "#1E72BA",
      mediaCaption: "",
      cta: { primary: { label: "Learn more", href: "/" } },
    };
    setSlides((arr) => [...arr, newSlide]);
  };

  const removeSlide = (index: number) => setSlides((arr) => arr.filter((_, i) => i !== index));
  const moveUp = (index: number) =>
    setSlides((arr) => {
      if (index <= 0) return arr;
      const next = [...arr];
      [next[index - 1], next[index]] = [next[index]!, next[index - 1]!];
      return next;
    });
  const moveDown = (index: number) =>
    setSlides((arr) => {
      if (index >= arr.length - 1) return arr;
      const next = [...arr];
      [next[index], next[index + 1]] = [next[index + 1]!, next[index]!];
      return next;
    });

  const onSave = async () => {
    setIsSubmitting(true);
    setSubmitState({ type: "idle", message: "" });
    try {
      const resp = await fetch("/api/admin/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ heroSlides: slides }),
      });
      const payload = (await resp.json().catch(() => null)) as ApiResponse | null;
      if (!resp.ok || !payload?.success) {
        throw new Error(payload?.message || "We couldn't save hero slides.");
      }
      setSubmitState({ type: "success", message: payload.message || "Slides updated." });
      router.refresh();
    } catch (err) {
      setSubmitState({ type: "error", message: err instanceof Error ? err.message : "We couldn't save hero slides." });
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
        <button onClick={addSlide} type="button" className="inline-flex items-center gap-2 rounded-full border border-brand-border px-4 py-2 text-sm font-semibold text-brand-ink">
          <Plus className="h-4 w-4" /> Add slide
        </button>
        <button onClick={onSave} disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70">
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
        </button>
      </div>

      <div className="space-y-6">
        {slides.map((s, i) => (
          <section key={s.id} className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-heading text-lg font-semibold text-brand-ink">Slide {i + 1}</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => moveUp(i)} type="button" className="rounded-full border border-brand-border p-2 text-brand-ink"><ArrowUp className="h-4 w-4" /></button>
                <button onClick={() => moveDown(i)} type="button" className="rounded-full border border-brand-border p-2 text-brand-ink"><ArrowDown className="h-4 w-4" /></button>
                <button onClick={() => removeSlide(i)} type="button" className="rounded-full border border-rose-200 p-2 text-rose-700"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-sm font-bold text-brand-ink">Slide ID</label>
                <input className={input} value={s.id} onChange={(e) => update(i, "id", e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-bold text-brand-ink">Eyebrow</label>
                <input className={input} value={s.eyebrow} onChange={(e) => update(i, "eyebrow", e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-bold text-brand-ink">Heading</label>
                <input className={input} value={s.heading} onChange={(e) => update(i, "heading", e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-bold text-brand-ink">Body / intro (optional)</label>
                <input className={input} value={s.body} onChange={(e) => update(i, "body", e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-bold text-brand-ink">Image URL</label>
                <input className={input} value={s.image} onChange={(e) => update(i, "image", e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-bold text-brand-ink">Overlay from (rgba)</label>
                <input className={input} value={s.overlayFrom} onChange={(e) => update(i, "overlayFrom", e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-bold text-brand-ink">Overlay to (rgba)</label>
                <input className={input} value={s.overlayTo} onChange={(e) => update(i, "overlayTo", e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-bold text-brand-ink" htmlFor={`slide-accent-${i}`}>
                  Accent colour (hex)
                </label>
                <input
                  id={`slide-accent-${i}`}
                  className={input}
                  value={s.accent ?? ""}
                  placeholder="#1E72BA"
                  onChange={(e) => update(i, "accent", e.target.value)}
                />
                <p className="mt-1.5 text-xs text-brand-muted">
                  Drives the progress ring, the eyebrow rule and the stage glow for this slide.
                  Leave blank to use the brand primary.
                </p>
              </div>
              <div>
                <label className="text-sm font-bold text-brand-ink" htmlFor={`slide-caption-${i}`}>
                  Media caption (optional)
                </label>
                <input
                  id={`slide-caption-${i}`}
                  className={input}
                  value={s.mediaCaption ?? ""}
                  placeholder="Graduation day, Accra"
                  onChange={(e) => update(i, "mediaCaption", e.target.value)}
                />
                <p className="mt-1.5 text-xs text-brand-muted">
                  Short label shown across the circular image. Hidden on small screens.
                </p>
              </div>
              <div>
                <label className="text-sm font-bold text-brand-ink">Primary CTA label</label>
                <input className={input} value={s.cta.primary.label} onChange={(e) => updateCta(i, "primary", "label", e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-bold text-brand-ink">Primary CTA href</label>
                <input className={input} value={s.cta.primary.href} onChange={(e) => updateCta(i, "primary", "href", e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-bold text-brand-ink">Secondary CTA label</label>
                <input className={input} value={s.cta.secondary?.label ?? ""} onChange={(e) => updateCta(i, "secondary", "label", e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-bold text-brand-ink">Secondary CTA href</label>
                <input className={input} value={s.cta.secondary?.href ?? ""} onChange={(e) => updateCta(i, "secondary", "href", e.target.value)} />
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
