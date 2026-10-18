"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2, Save } from "lucide-react";

import type {
  ChallengeSectionContent,
  MissionSectionContent,
  OverviewSectionContent,
} from "@/components/home/legacy-homepage-sections";

type ApiResponse = { success?: boolean; message?: string };
type SubmitState = { type: "idle" | "success" | "error"; message: string };

const input =
  "mt-2 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20";

function Notice({ state }: { state: SubmitState }) {
  if (state.type === "idle") return null;
  return (
    <div className={`flex items-start gap-3 rounded-[24px] border p-5 text-sm font-medium ${state.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
      {state.type === "success" ? <CheckCircle2 className="mt-0.5 h-5 w-5" /> : <AlertCircle className="mt-0.5 h-5 w-5" />}
      <span>{state.message}</span>
    </div>
  );
}

async function saveHomepageField(field: string, values: unknown) {
  const response = await fetch("/api/admin/homepage", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ [field]: values }),
  });
  const payload = (await response.json().catch(() => null)) as ApiResponse | null;
  if (!response.ok || !payload?.success) {
    throw new Error(payload?.message || "We couldn't save this homepage section.");
  }
  return payload.message || "Homepage section updated.";
}

export function ChallengeSectionForm({ initial }: { initial: ChallengeSectionContent }) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState<SubmitState>({ type: "idle", message: "" });
  const update = <K extends keyof ChallengeSectionContent>(key: K, value: ChallengeSectionContent[K]) =>
    setValues((current) => ({ ...current, [key]: value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setState({ type: "idle", message: "" });
    try {
      const message = await saveHomepageField("challengeSection", values);
      setState({ type: "success", message });
      router.refresh();
    } catch (error) {
      setState({ type: "error", message: error instanceof Error ? error.message : "Save failed." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <Notice state={state} />
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Section title" value={values.title} onChange={(value) => update("title", value)} />
        <Field label="Headline" value={values.headline} onChange={(value) => update("headline", value)} />
        <Field label="Description (optional)" value={values.description} onChange={(value) => update("description", value)} textarea wide />
        {values.stats.map((stat, index) => (
          <div key={index} className="rounded-2xl border border-brand-border bg-brand-mist/40 p-4 md:col-span-2">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-accent">Statistic {index + 1}</p>
            <div className="mt-3 grid gap-4 md:grid-cols-3">
              {(["value", "label", "description"] as const).map((key) => (
                <Field key={key} label={key[0].toUpperCase() + key.slice(1)} value={stat[key]} onChange={(value) => update("stats", values.stats.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item))} />
              ))}
            </div>
          </div>
        ))}
        <Field label="Band image URL (optional)" value={values.image ?? ""} onChange={(value) => update("image", value)} />
        <Field label="Band image alt text" value={values.imageAlt ?? ""} onChange={(value) => update("imageAlt", value)} />
        <Field label="Comparison title" value={values.comparisonTitle} onChange={(value) => update("comparisonTitle", value)} wide />
        <Field label="Problem column title" value={values.problemTitle} onChange={(value) => update("problemTitle", value)} />
        <Field label="Solution column title" value={values.solutionTitle} onChange={(value) => update("solutionTitle", value)} />
        <Field label="Problem items (one per line)" value={values.problemItems.join("\n")} onChange={(value) => update("problemItems", value.split("\n").filter(Boolean))} textarea />
        <Field label="Solution items (one per line)" value={values.solutionItems.join("\n")} onChange={(value) => update("solutionItems", value.split("\n").filter(Boolean))} textarea />
        <Field label="CTA supporting text" value={values.ctaText} onChange={(value) => update("ctaText", value)} wide />
        <Field label="CTA label" value={values.ctaLabel} onChange={(value) => update("ctaLabel", value)} />
        <Field label="CTA link" value={values.ctaHref} onChange={(value) => update("ctaHref", value)} />
        <Active checked={values.active !== false} onChange={(checked) => update("active", checked)} />
      </div>
      <SaveButton busy={busy} label="Save challenge section" />
    </form>
  );
}

export function OverviewSectionForm({ initial }: { initial: OverviewSectionContent }) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState<SubmitState>({ type: "idle", message: "" });
  const update = <K extends keyof OverviewSectionContent>(key: K, value: OverviewSectionContent[K]) =>
    setValues((current) => ({ ...current, [key]: value }));
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setState({ type: "idle", message: "" });
    try {
      const message = await saveHomepageField("overviewSection", values);
      setState({ type: "success", message });
      router.refresh();
    } catch (error) {
      setState({ type: "error", message: error instanceof Error ? error.message : "Save failed." });
    } finally { setBusy(false); }
  };
  return <form onSubmit={submit} className="space-y-6">
    <Notice state={state} />
    <div className="grid gap-5 md:grid-cols-2">
      <Field label="Section title" value={values.title} onChange={(value) => update("title", value)} />
      <Field label="Headline" value={values.headline} onChange={(value) => update("headline", value)} />
      <Field label="Description (optional)" value={values.description} onChange={(value) => update("description", value)} textarea wide />
      <Field label="Story title" value={values.storyTitle} onChange={(value) => update("storyTitle", value)} />
      <Field label="Story headline" value={values.storyHeadline} onChange={(value) => update("storyHeadline", value)} />
      <Field label="Story description" value={values.storyDescription} onChange={(value) => update("storyDescription", value)} textarea wide />
      <Field label="Callout" value={values.callout} onChange={(value) => update("callout", value)} textarea wide />
      <Field label="Image URL" value={values.image} onChange={(value) => update("image", value)} />
      <Field label="Image alt text" value={values.imageAlt} onChange={(value) => update("imageAlt", value)} />
      <Field label="Image label" value={values.imageLabel} onChange={(value) => update("imageLabel", value)} />
      <Field label="Image caption" value={values.imageCaption} onChange={(value) => update("imageCaption", value)} />
      <Field label="Video URL (optional)" value={values.videoUrl ?? ""} onChange={(value) => update("videoUrl", value)} wide />
      <Field label="Video title (optional)" value={values.videoTitle ?? ""} onChange={(value) => update("videoTitle", value)} wide />
      <Field label="CTA label" value={values.ctaLabel} onChange={(value) => update("ctaLabel", value)} />
      <Field label="CTA link" value={values.ctaHref} onChange={(value) => update("ctaHref", value)} />
      <Active checked={values.active !== false} onChange={(checked) => update("active", checked)} />
    </div>
    <SaveButton busy={busy} label="Save overview section" />
  </form>;
}

export function MissionSectionForm({ initial }: { initial: MissionSectionContent }) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState<SubmitState>({ type: "idle", message: "" });
  const update = <K extends keyof MissionSectionContent>(key: K, value: MissionSectionContent[K]) =>
    setValues((current) => ({ ...current, [key]: value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setState({ type: "idle", message: "" });
    try {
      const message = await saveHomepageField("missionSection", values);
      setState({ type: "success", message });
      router.refresh();
    } catch (error) {
      setState({ type: "error", message: error instanceof Error ? error.message : "Save failed." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <Notice state={state} />
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Section title" value={values.title} onChange={(value) => update("title", value)} />
        <Field label="Headline" value={values.headline} onChange={(value) => update("headline", value)} />
        <Field label="Description (optional)" value={values.description} onChange={(value) => update("description", value)} textarea wide />
        <Field label="Image path" value={values.image} onChange={(value) => update("image", value)} />
        <Field label="Image alt text" value={values.imageAlt} onChange={(value) => update("imageAlt", value)} />
        <Field label="Image label" value={values.imageLabel} onChange={(value) => update("imageLabel", value)} />
        <Field label="Image caption" value={values.imageCaption} onChange={(value) => update("imageCaption", value)} />
        <Field label="Video URL (optional)" value={values.videoUrl ?? ""} onChange={(value) => update("videoUrl", value)} wide />
        <Field label="Video title (optional)" value={values.videoTitle ?? ""} onChange={(value) => update("videoTitle", value)} wide />
        <Field label="Mission title" value={values.missionTitle} onChange={(value) => update("missionTitle", value)} />
        <Field label="Mission headline" value={values.missionHeadline} onChange={(value) => update("missionHeadline", value)} />
        <Field label="Mission description" value={values.missionDescription} onChange={(value) => update("missionDescription", value)} textarea wide />
        <Field label="CTA label" value={values.ctaLabel} onChange={(value) => update("ctaLabel", value)} />
        <Field label="CTA link" value={values.ctaHref} onChange={(value) => update("ctaHref", value)} />
        <Active checked={values.active !== false} onChange={(checked) => update("active", checked)} />
      </div>
      <SaveButton busy={busy} label="Save mission section" />
    </form>
  );
}

function Field({ label, value, onChange, textarea = false, wide = false }: { label: string; value: string; onChange: (value: string) => void; textarea?: boolean; wide?: boolean }) {
  return (
    <label className={wide ? "md:col-span-2" : ""}>
      <span className="text-sm font-bold text-brand-ink">{label}</span>
      {textarea ? <textarea className={`${input} h-28`} value={value} onChange={(event) => onChange(event.target.value)} /> : <input className={input} value={value} onChange={(event) => onChange(event.target.value)} />}
    </label>
  );
}

function Active({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return <label className="inline-flex items-center gap-3 rounded-2xl border border-brand-border bg-brand-mist px-4 py-3 text-sm font-medium text-brand-ink"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4 rounded border-slate-300" />Active</label>;
}

function SaveButton({ busy, label }: { busy: boolean; label: string }) {
  return <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-70">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{label}</button>;
}
