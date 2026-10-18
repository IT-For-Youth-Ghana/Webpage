"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

import type {
  ActionLink,
  ContentBlock,
  HighlightStat,
  RouteCard,
} from "@/types/content";
import type { NewsPageContent, NewsPageSlug } from "@/lib/cms/news-pages";

type ApiResponse = { success?: boolean; message?: string; errors?: unknown };
type SubmitState = { type: "idle" | "success" | "error"; message: string };

type NewsPageFormProps = {
  slug: NewsPageSlug;
  initial: NewsPageContent;
  endpoint: string;
};

type TextFieldKey =
  | "eyebrow"
  | "title"
  | "description"
  | "heroImage"
  | "emptyState"
  | "featuredSectionEyebrow" | "featuredSectionTitle" | "featuredSectionDescription"
  | "browseSectionEyebrow" | "browseSectionTitle" | "browseSectionDescription"
  | "editorialSectionEyebrow" | "editorialSectionTitle" | "editorialSectionDescription"
  | "latestSectionEyebrow" | "latestSectionTitle" | "latestSectionDescription"
  | "subscribeSectionEyebrow" | "subscribeSectionTitle" | "subscribeSectionDescription"
  | "heroCtaLabel" | "leadSectionEyebrow" | "leadSectionTitle" | "leadSectionDescription"
  | "archiveSectionEyebrow" | "archiveSectionTitle" | "archiveSectionDescription"
  | "topicsSectionEyebrow" | "topicsSectionTitle" | "topicsSectionDescription"
  | "latestSignalEyebrow" | "latestSignalCtaLabel";

const inputClass =
  "mt-2 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20";
const panelClass = "rounded-[30px] border border-brand-border bg-white p-6 shadow-sm lg:p-8";
const compactButtonClass =
  "inline-flex items-center gap-2 rounded-full border border-brand-border px-4 py-2 text-sm font-semibold text-brand-ink";

const emptyStat: HighlightStat = { value: "", label: "", description: "", icon: "", iconImage: "" };
const emptyPillar: ContentBlock = { title: "", body: "", bullets: [] };
const emptyRouteCard: RouteCard = { href: "/", eyebrow: "", title: "", description: "" };
const emptyActionLink: ActionLink = { label: "", href: "" };

function hasKey<Key extends PropertyKey>(value: object, key: Key): value is Record<Key, unknown> {
  return key in value;
}

function readText(value: object, key: TextFieldKey) {
  return hasKey(value, key) && typeof value[key] === "string" ? value[key] : "";
}

function arrayValue<Item>(value: object, key: string): Item[] {
  if (!hasKey(value, key)) {
    return [];
  }

  return Array.isArray(value[key]) ? (value[key] as Item[]) : [];
}

function fromLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-bold text-brand-ink">{label}</label>
      {multiline ? (
        <textarea className={`${inputClass} h-28`} value={value} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input className={inputClass} value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </div>
  );
}

function StatsEditor({ values, onChange }: { values: HighlightStat[]; onChange: (values: HighlightStat[]) => void }) {
  return (
    <section className={panelClass}>
      <h3 className="font-heading text-xl font-semibold text-brand-ink">Hub stats</h3>
      <div className="mt-4 space-y-4">
        {values.map((stat, index) => (
          <div key={`stat-${index}`} className="grid gap-4 rounded-2xl border border-brand-border p-4 md:grid-cols-2">
            <Field label="Value" value={stat.value} onChange={(value) => onChange(values.map((item, itemIndex) => (itemIndex === index ? { ...item, value } : item)))} />
            <Field label="Label" value={stat.label} onChange={(value) => onChange(values.map((item, itemIndex) => (itemIndex === index ? { ...item, label: value } : item)))} />
            <Field label="Icon" value={stat.icon ?? ""} onChange={(value) => onChange(values.map((item, itemIndex) => (itemIndex === index ? { ...item, icon: value } : item)))} />
            <Field label="Icon image URL" value={stat.iconImage ?? ""} onChange={(value) => onChange(values.map((item, itemIndex) => (itemIndex === index ? { ...item, iconImage: value } : item)))} />
            <Field label="Description" value={stat.description ?? ""} onChange={(value) => onChange(values.map((item, itemIndex) => (itemIndex === index ? { ...item, description: value } : item)))} />
            <button type="button" onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))} className="justify-self-start rounded-full border border-rose-200 p-3 text-rose-700">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button type="button" onClick={() => onChange([...values, emptyStat])} className={compactButtonClass}>
          <Plus className="h-4 w-4" /> Add stat
        </button>
      </div>
    </section>
  );
}

function PillarsEditor({ values, onChange }: { values: ContentBlock[]; onChange: (values: ContentBlock[]) => void }) {
  return (
    <section className={panelClass}>
      <h3 className="font-heading text-xl font-semibold text-brand-ink">Editorial pillars</h3>
      <div className="mt-4 space-y-4">
        {values.map((pillar, index) => (
          <div key={`pillar-${index}`} className="grid gap-4 rounded-2xl border border-brand-border p-4 md:grid-cols-2">
            <Field label="Title" value={pillar.title} onChange={(value) => onChange(values.map((item, itemIndex) => (itemIndex === index ? { ...item, title: value } : item)))} />
            <div className="md:col-span-2">
              <Field label="Body" value={pillar.body} multiline onChange={(value) => onChange(values.map((item, itemIndex) => (itemIndex === index ? { ...item, body: value } : item)))} />
            </div>
            <div className="md:col-span-2">
              <Field label="Bullets (one per line)" value={(pillar.bullets ?? []).join("\n")} multiline onChange={(value) => onChange(values.map((item, itemIndex) => (itemIndex === index ? { ...item, bullets: fromLines(value) } : item)))} />
            </div>
            <button type="button" onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))} className="justify-self-start rounded-full border border-rose-200 p-3 text-rose-700">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button type="button" onClick={() => onChange([...values, emptyPillar])} className={compactButtonClass}>
          <Plus className="h-4 w-4" /> Add pillar
        </button>
      </div>
    </section>
  );
}

function RouteCardsEditor({ values, onChange }: { values: RouteCard[]; onChange: (values: RouteCard[]) => void }) {
  return (
    <section className={panelClass}>
      <h3 className="font-heading text-xl font-semibold text-brand-ink">Route cards</h3>
      <div className="mt-4 space-y-4">
        {values.map((card, index) => (
          <div key={`route-${index}`} className="grid gap-4 rounded-2xl border border-brand-border p-4 md:grid-cols-2">
            <Field label="Eyebrow" value={card.eyebrow ?? ""} onChange={(value) => onChange(values.map((item, itemIndex) => (itemIndex === index ? { ...item, eyebrow: value } : item)))} />
            <Field label="Title" value={card.title} onChange={(value) => onChange(values.map((item, itemIndex) => (itemIndex === index ? { ...item, title: value } : item)))} />
            <Field label="Href" value={card.href} onChange={(value) => onChange(values.map((item, itemIndex) => (itemIndex === index ? { ...item, href: value } : item)))} />
            <Field label="Description" value={card.description} onChange={(value) => onChange(values.map((item, itemIndex) => (itemIndex === index ? { ...item, description: value } : item)))} />
            <button type="button" onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))} className="justify-self-start rounded-full border border-rose-200 p-3 text-rose-700">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button type="button" onClick={() => onChange([...values, emptyRouteCard])} className={compactButtonClass}>
          <Plus className="h-4 w-4" /> Add route
        </button>
      </div>
    </section>
  );
}

function ActionLinksEditor({ title, values, onChange }: { title: string; values: ActionLink[]; onChange: (values: ActionLink[]) => void }) {
  return <section className={panelClass}>
    <h3 className="font-heading text-xl font-semibold text-brand-ink">{title}</h3>
    <div className="mt-4 space-y-4">
      {values.map((link, index) => <div key={`${title}-${index}`} className="grid gap-4 rounded-2xl border border-brand-border p-4 md:grid-cols-2">
        <Field label="Label" value={link.label} onChange={(value) => onChange(values.map((item, itemIndex) => itemIndex === index ? { ...item, label: value } : item))} />
        <Field label="Href" value={link.href} onChange={(value) => onChange(values.map((item, itemIndex) => itemIndex === index ? { ...item, href: value } : item))} />
        <button type="button" onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))} className="justify-self-start rounded-full border border-rose-200 p-3 text-rose-700"><Trash2 className="h-4 w-4" /></button>
      </div>)}
      <button type="button" onClick={() => onChange([...values, emptyActionLink])} className={compactButtonClass}><Plus className="h-4 w-4" /> Add link</button>
    </div>
  </section>;
}

export function NewsPageForm({ slug, initial, endpoint }: NewsPageFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<NewsPageContent>(() => initial);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>({ type: "idle", message: "" });

  const updateText = (key: TextFieldKey, value: string) => {
    setValues((current) => ({ ...current, [key]: value }) as NewsPageContent);
  };

  const updateArray = <Item,>(key: string, nextValues: Item[]) => {
    setValues((current) => ({ ...current, [key]: nextValues }) as NewsPageContent);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitState({ type: "idle", message: "" });

    try {
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const payload = (await response.json().catch(() => null)) as ApiResponse | null;

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || "We could not save this news page.");
      }

      setSubmitState({ type: "success", message: payload.message || "News page updated." });
      router.refresh();
    } catch (error) {
      setSubmitState({
        type: "error",
        message: error instanceof Error ? error.message : "We could not save this news page.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {submitState.type !== "idle" ? (
        <div className={`flex items-start gap-3 rounded-[24px] border p-5 text-sm font-medium ${submitState.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
          {submitState.type === "success" ? <CheckCircle2 className="mt-0.5 h-5 w-5" /> : <AlertCircle className="mt-0.5 h-5 w-5" />}
          <span>{submitState.message}</span>
        </div>
      ) : null}

      <section className={panelClass}>
        <h3 className="font-heading text-xl font-semibold text-brand-ink">Page hero</h3>
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          <Field label="Eyebrow" value={readText(values, "eyebrow")} onChange={(value) => updateText("eyebrow", value)} />
          <Field label="Hero image" value={readText(values, "heroImage")} onChange={(value) => updateText("heroImage", value)} />
          <div className="md:col-span-2">
            <Field label="Title" value={readText(values, "title")} onChange={(value) => updateText("title", value)} />
          </div>
          <div className="md:col-span-2">
            <Field label="Description (optional)" value={readText(values, "description")} multiline onChange={(value) => updateText("description", value)} />
          </div>
          {slug !== "hub" ? (
            <div className="md:col-span-2">
              <Field label="Empty state" value={readText(values, "emptyState")} multiline onChange={(value) => updateText("emptyState", value)} />
            </div>
          ) : null}
        </div>
      </section>

      {slug === "hub" ? (
        <>
          <section className={panelClass}>
            <h3 className="font-heading text-xl font-semibold text-brand-ink">Public section framing</h3>
            <div className="mt-4 space-y-6">
              {([
                ["Featured", "featuredSectionEyebrow", "featuredSectionTitle", "featuredSectionDescription"],
                ["Browse", "browseSectionEyebrow", "browseSectionTitle", "browseSectionDescription"],
                ["Editorial", "editorialSectionEyebrow", "editorialSectionTitle", "editorialSectionDescription"],
                ["Latest", "latestSectionEyebrow", "latestSectionTitle", "latestSectionDescription"],
                ["Subscribe", "subscribeSectionEyebrow", "subscribeSectionTitle", "subscribeSectionDescription"],
              ] as const).map(([label, eyebrow, title, description]) => <div key={label} className="grid gap-4 rounded-2xl border border-brand-border p-4 md:grid-cols-2">
                <p className="font-heading text-lg font-semibold text-brand-ink md:col-span-2">{label}</p>
                <Field label="Eyebrow" value={readText(values, eyebrow)} onChange={(value) => updateText(eyebrow, value)} />
                <Field label="Title" value={readText(values, title)} onChange={(value) => updateText(title, value)} />
                <div className="md:col-span-2"><Field label="Description" value={readText(values, description)} multiline onChange={(value) => updateText(description, value)} /></div>
              </div>)}
            </div>
          </section>
          <ActionLinksEditor title="Hero CTAs" values={arrayValue<ActionLink>(values, "heroCtas")} onChange={(nextValues) => updateArray("heroCtas", nextValues)} />
          <StatsEditor values={arrayValue<HighlightStat>(values, "stats")} onChange={(nextValues) => updateArray("stats", nextValues)} />
          <PillarsEditor values={arrayValue<ContentBlock>(values, "editorialPillars")} onChange={(nextValues) => updateArray("editorialPillars", nextValues)} />
          <RouteCardsEditor values={arrayValue<RouteCard>(values, "routeCards")} onChange={(nextValues) => updateArray("routeCards", nextValues)} />
          <ActionLinksEditor title="Subscribe CTAs" values={arrayValue<ActionLink>(values, "subscribeCtas")} onChange={(nextValues) => updateArray("subscribeCtas", nextValues)} />
        </>
      ) : <section className={panelClass}>
        <h3 className="font-heading text-xl font-semibold text-brand-ink">Public section framing</h3>
        <div className="mt-4 space-y-6">
          {([
            ["Lead article", "leadSectionEyebrow", "leadSectionTitle", "leadSectionDescription"],
            ["Archive", "archiveSectionEyebrow", "archiveSectionTitle", "archiveSectionDescription"],
            ["Topics", "topicsSectionEyebrow", "topicsSectionTitle", "topicsSectionDescription"],
          ] as const).map(([label, eyebrow, title, description]) => <div key={label} className="grid gap-4 rounded-2xl border border-brand-border p-4 md:grid-cols-2">
            <p className="font-heading text-lg font-semibold text-brand-ink md:col-span-2">{label}</p>
            <Field label="Eyebrow" value={readText(values, eyebrow)} onChange={(value) => updateText(eyebrow, value)} />
            <Field label="Title" value={readText(values, title)} onChange={(value) => updateText(title, value)} />
            <div className="md:col-span-2"><Field label="Description" value={readText(values, description)} multiline onChange={(value) => updateText(description, value)} /></div>
          </div>)}
          <div className="grid gap-4 rounded-2xl border border-brand-border p-4 md:grid-cols-2">
            <Field label="Hero CTA label" value={readText(values, "heroCtaLabel")} onChange={(value) => updateText("heroCtaLabel", value)} />
            <Field label="Latest signal eyebrow" value={readText(values, "latestSignalEyebrow")} onChange={(value) => updateText("latestSignalEyebrow", value)} />
            <Field label="Latest signal CTA label" value={readText(values, "latestSignalCtaLabel")} onChange={(value) => updateText("latestSignalCtaLabel", value)} />
          </div>
        </div>
      </section>}

      <div className="flex items-center gap-3 rounded-[26px] border border-brand-border bg-white px-5 py-4 shadow-sm">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save news page
        </button>
      </div>
    </form>
  );
}
