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
  HighlightStat,
  ImpactEvidenceCard,
  ImpactFeaturedStory,
  ImpactReportResource,
  ImpactSdgGoal,
  ImpactStory,
  RouteCard,
} from "@/types/content";
import type { ImpactPageContent, ImpactPageSlug } from "@/lib/cms/impact-pages";

type ApiResponse = { success?: boolean; message?: string; errors?: unknown };
type SubmitState = { type: "idle" | "success" | "error"; message: string };

type ImpactPageFormProps = {
  slug: ImpactPageSlug;
  initial: ImpactPageContent;
  endpoint: string;
};

type TextFieldKey =
  | "eyebrow"
  | "title"
  | "description"
  | "heroImage"
  | "heroAsideEyebrow"
  | "snapshotSectionEyebrow"
  | "snapshotSectionTitle"
  | "snapshotSectionDescription"
  | "measurementSectionEyebrow"
  | "measurementSectionTitle"
  | "measurementSectionDescription"
  | "measurementCardBadgeLabel"
  | "routesSectionEyebrow"
  | "routesSectionTitle"
  | "routesSectionDescription"
  | "partnersHeading"
  | "reportsSectionEyebrow"
  | "reportsSectionTitle"
  | "reportsSectionDescription"
  | "reportBadgeLabel"
  | "methodSectionEyebrow"
  | "methodSectionTitle"
  | "methodSectionDescription"
  | "methodBadgeEyebrow"
  | "methodCardBadgeLabel"
  | "nextStepsSectionEyebrow"
  | "nextStepsSectionTitle"
  | "nextStepsSectionDescription"
  | "listSectionEyebrow"
  | "listSectionTitle"
  | "listSectionDescription"
  | "goalsSectionEyebrow"
  | "goalsSectionTitle"
  | "goalsSectionDescription"
  | "principlesSectionEyebrow"
  | "principlesSectionTitle"
  | "principlesSectionDescription"
  | "methodVideoUrl"
  | "methodVideoTitle"
  | "principlesVideoUrl"
  | "principlesVideoTitle";

const inputClass =
  "mt-2 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20";
const panelClass = "rounded-[30px] border border-brand-border bg-white p-6 shadow-sm lg:p-8";
const compactButtonClass =
  "inline-flex items-center gap-2 rounded-full border border-brand-border px-4 py-2 text-sm font-semibold text-brand-ink";

const emptyStat: HighlightStat = { value: "", label: "", description: "", icon: "", iconImage: "" };
const emptyEvidenceCard: ImpactEvidenceCard = { title: "", description: "", icon: "", bullets: [] };
const emptyRouteCard: RouteCard = { href: "/", eyebrow: "", title: "", description: "" };
const emptyReport: ImpactReportResource = {
  id: "",
  year: "",
  title: "",
  summary: "",
  href: "",
  fileLabel: "Download brief",
  highlights: [],
};
const emptyStory: ImpactStory = {
  id: "",
  title: "",
  quote: "",
  name: "",
  role: "",
  programme: "",
  year: "",
  theme: "",
  image: "",
  format: "written",
};
const emptyGoal: ImpactSdgGoal = {
  goal: "",
  title: "",
  summary: "",
  icon: "",
  contributions: [],
  linkedRoutes: [],
};

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

function lineList(value: string[]) {
  return value.join("\n");
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

function TextListEditor({
  title,
  values,
  onChange,
  addLabel,
}: {
  title: string;
  values: string[];
  onChange: (values: string[]) => void;
  addLabel: string;
}) {
  return (
    <section className={panelClass}>
      <h3 className="font-heading text-xl font-semibold text-brand-ink">{title}</h3>
      <div className="mt-4 space-y-3">
        {values.map((item, index) => (
          <div key={`${title}-${index}`} className="flex gap-3">
            <textarea
              className={`${inputClass} mt-0 h-20`}
              value={item}
              onChange={(event) =>
                onChange(values.map((entry, itemIndex) => (itemIndex === index ? event.target.value : entry)))
              }
            />
            <button
              type="button"
              onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))}
              className="h-11 rounded-full border border-rose-200 p-3 text-rose-700"
              aria-label={`Remove ${title} item`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button type="button" onClick={() => onChange([...values, ""])} className={compactButtonClass}>
          <Plus className="h-4 w-4" /> {addLabel}
        </button>
      </div>
    </section>
  );
}

function StatsEditor({ values, onChange }: { values: HighlightStat[]; onChange: (values: HighlightStat[]) => void }) {
  return (
    <section className={panelClass}>
      <h3 className="font-heading text-xl font-semibold text-brand-ink">Stats</h3>
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

function EvidenceCardsEditor({
  title,
  values,
  onChange,
}: {
  title: string;
  values: ImpactEvidenceCard[];
  onChange: (values: ImpactEvidenceCard[]) => void;
}) {
  return (
    <section className={panelClass}>
      <h3 className="font-heading text-xl font-semibold text-brand-ink">{title}</h3>
      <div className="mt-4 space-y-4">
        {values.map((card, index) => (
          <div key={`${title}-${index}`} className="grid gap-4 rounded-2xl border border-brand-border p-4 md:grid-cols-2">
            <Field label="Title" value={card.title} onChange={(value) => onChange(values.map((item, itemIndex) => (itemIndex === index ? { ...item, title: value } : item)))} />
            <Field label="Icon" value={card.icon} onChange={(value) => onChange(values.map((item, itemIndex) => (itemIndex === index ? { ...item, icon: value } : item)))} />
            <div className="md:col-span-2">
              <Field label="Description" value={card.description} multiline onChange={(value) => onChange(values.map((item, itemIndex) => (itemIndex === index ? { ...item, description: value } : item)))} />
            </div>
            <div className="md:col-span-2">
              <Field label="Bullets (one per line)" value={lineList(card.bullets)} multiline onChange={(value) => onChange(values.map((item, itemIndex) => (itemIndex === index ? { ...item, bullets: fromLines(value) } : item)))} />
            </div>
            <button type="button" onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))} className="justify-self-start rounded-full border border-rose-200 p-3 text-rose-700">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button type="button" onClick={() => onChange([...values, emptyEvidenceCard])} className={compactButtonClass}>
          <Plus className="h-4 w-4" /> Add card
        </button>
      </div>
    </section>
  );
}

function RouteCardsEditor({ title, values, onChange }: { title: string; values: RouteCard[]; onChange: (values: RouteCard[]) => void }) {
  return (
    <section className={panelClass}>
      <h3 className="font-heading text-xl font-semibold text-brand-ink">{title}</h3>
      <div className="mt-4 space-y-4">
        {values.map((card, index) => (
          <div key={`${title}-${index}`} className="grid gap-4 rounded-2xl border border-brand-border p-4 md:grid-cols-2">
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

function ReportsEditor({ values, onChange }: { values: ImpactReportResource[]; onChange: (values: ImpactReportResource[]) => void }) {
  return (
    <section className={panelClass}>
      <h3 className="font-heading text-xl font-semibold text-brand-ink">Report resources</h3>
      <div className="mt-4 space-y-4">
        {values.map((report, index) => (
          <div key={`report-${index}`} className="grid gap-4 rounded-2xl border border-brand-border p-4 md:grid-cols-2">
            {(["id", "year", "title", "href", "fileLabel"] as const).map((key) => (
              <Field key={key} label={key} value={report[key]} onChange={(value) => onChange(values.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)))} />
            ))}
            <div className="md:col-span-2">
              <Field label="Summary" value={report.summary} multiline onChange={(value) => onChange(values.map((item, itemIndex) => (itemIndex === index ? { ...item, summary: value } : item)))} />
            </div>
            <div className="md:col-span-2">
              <Field label="Highlights (one per line)" value={lineList(report.highlights)} multiline onChange={(value) => onChange(values.map((item, itemIndex) => (itemIndex === index ? { ...item, highlights: fromLines(value) } : item)))} />
            </div>
            <button type="button" onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))} className="justify-self-start rounded-full border border-rose-200 p-3 text-rose-700">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button type="button" onClick={() => onChange([...values, emptyReport])} className={compactButtonClass}>
          <Plus className="h-4 w-4" /> Add report
        </button>
      </div>
    </section>
  );
}

function FeaturedStoryEditor({
  value,
  onChange,
}: {
  value: ImpactFeaturedStory;
  onChange: (value: ImpactFeaturedStory) => void;
}) {
  return (
    <section className={panelClass}>
      <h3 className="font-heading text-xl font-semibold text-brand-ink">Featured story</h3>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {(["label", "headline", "quote", "name", "role", "programme", "backgroundImage", "videoUrl", "primaryCtaLabel"] as const).map((key) => (
          <Field key={key} label={key} value={value[key] ?? ""} multiline={key === "quote" || key === "headline"} onChange={(fieldValue) => onChange({ ...value, [key]: fieldValue })} />
        ))}
        <Field label="Secondary CTA label" value={value.secondaryCta.label} onChange={(fieldValue) => onChange({ ...value, secondaryCta: { ...value.secondaryCta, label: fieldValue } })} />
        <Field label="Secondary CTA href" value={value.secondaryCta.href} onChange={(fieldValue) => onChange({ ...value, secondaryCta: { ...value.secondaryCta, href: fieldValue } })} />
      </div>
    </section>
  );
}

function StoriesEditor({ values, onChange }: { values: ImpactStory[]; onChange: (values: ImpactStory[]) => void }) {
  return (
    <section className={panelClass}>
      <h3 className="font-heading text-xl font-semibold text-brand-ink">Stories</h3>
      <div className="mt-4 space-y-4">
        {values.map((story, index) => (
          <div key={`story-${index}`} className="grid gap-4 rounded-2xl border border-brand-border p-4 md:grid-cols-2">
            {(["id", "title", "name", "role", "programme", "year", "theme", "image"] as const).map((key) => (
              <Field key={key} label={key} value={story[key] ?? ""} onChange={(value) => onChange(values.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)))} />
            ))}
            <div>
              <label className="text-sm font-bold text-brand-ink">Format</label>
              <select
                className={inputClass}
                value={story.format}
                onChange={(event) => onChange(values.map((item, itemIndex) => (itemIndex === index ? { ...item, format: event.target.value as ImpactStory["format"] } : item)))}
              >
                <option value="written">written</option>
                <option value="video">video</option>
                <option value="partner">partner</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <Field label="Quote" value={story.quote} multiline onChange={(value) => onChange(values.map((item, itemIndex) => (itemIndex === index ? { ...item, quote: value } : item)))} />
            </div>
            <button type="button" onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))} className="justify-self-start rounded-full border border-rose-200 p-3 text-rose-700">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button type="button" onClick={() => onChange([...values, emptyStory])} className={compactButtonClass}>
          <Plus className="h-4 w-4" /> Add story
        </button>
      </div>
    </section>
  );
}

function GoalsEditor({ values, onChange }: { values: ImpactSdgGoal[]; onChange: (values: ImpactSdgGoal[]) => void }) {
  return (
    <section className={panelClass}>
      <h3 className="font-heading text-xl font-semibold text-brand-ink">SDG goals</h3>
      <div className="mt-4 space-y-4">
        {values.map((goal, index) => (
          <div key={`goal-${index}`} className="grid gap-4 rounded-2xl border border-brand-border p-4 md:grid-cols-2">
            {(["goal", "title", "icon"] as const).map((key) => (
              <Field key={key} label={key} value={goal[key]} onChange={(value) => onChange(values.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)))} />
            ))}
            <div className="md:col-span-2">
              <Field label="Summary" value={goal.summary} multiline onChange={(value) => onChange(values.map((item, itemIndex) => (itemIndex === index ? { ...item, summary: value } : item)))} />
            </div>
            <div className="md:col-span-2">
              <Field label="Contributions (one per line)" value={lineList(goal.contributions)} multiline onChange={(value) => onChange(values.map((item, itemIndex) => (itemIndex === index ? { ...item, contributions: fromLines(value) } : item)))} />
            </div>
            <div className="md:col-span-2">
              <RouteCardsEditor
                title="Linked routes"
                values={goal.linkedRoutes}
                onChange={(linkedRoutes) => onChange(values.map((item, itemIndex) => (itemIndex === index ? { ...item, linkedRoutes } : item)))}
              />
            </div>
            <button type="button" onClick={() => onChange(values.filter((_, itemIndex) => itemIndex !== index))} className="justify-self-start rounded-full border border-rose-200 p-3 text-rose-700">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button type="button" onClick={() => onChange([...values, emptyGoal])} className={compactButtonClass}>
          <Plus className="h-4 w-4" /> Add goal
        </button>
      </div>
    </section>
  );
}

function defaultFeaturedStory(): ImpactFeaturedStory {
  return {
    label: "",
    headline: "",
    quote: "",
    name: "",
    role: "",
    programme: "",
    backgroundImage: "",
    videoUrl: "",
    primaryCtaLabel: "",
    secondaryCta: { label: "", href: "/" },
  };
}

export function ImpactPageForm({ slug, initial, endpoint }: ImpactPageFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<ImpactPageContent>(() => initial);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>({ type: "idle", message: "" });

  const updateText = (key: TextFieldKey, value: string) => {
    setValues((current) => ({ ...current, [key]: value }) as ImpactPageContent);
  };

  const updateArray = <Item,>(key: string, nextValues: Item[]) => {
    setValues((current) => ({ ...current, [key]: nextValues }) as ImpactPageContent);
  };

  const updateFeaturedStory = (featuredStory: ImpactFeaturedStory) => {
    setValues((current) => ({ ...current, featuredStory }) as ImpactPageContent);
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
        throw new Error(payload?.message || "We could not save this impact page.");
      }

      setSubmitState({ type: "success", message: payload.message || "Impact page updated." });
      router.refresh();
    } catch (error) {
      setSubmitState({
        type: "error",
        message: error instanceof Error ? error.message : "We could not save this impact page.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const sharedSectionFields: TextFieldKey[] =
    slug === "overview"
      ? [
          "heroAsideEyebrow",
          "snapshotSectionEyebrow",
          "snapshotSectionTitle",
          "snapshotSectionDescription",
          "measurementSectionEyebrow",
          "measurementSectionTitle",
          "measurementSectionDescription",
          "measurementCardBadgeLabel",
          "routesSectionEyebrow",
          "routesSectionTitle",
          "routesSectionDescription",
          "partnersHeading",
        ]
      : slug === "reports"
        ? [
            "heroAsideEyebrow",
            "snapshotSectionEyebrow",
            "snapshotSectionTitle",
            "snapshotSectionDescription",
            "reportsSectionEyebrow",
            "reportsSectionTitle",
            "reportsSectionDescription",
            "reportBadgeLabel",
            "methodSectionEyebrow",
            "methodSectionTitle",
            "methodSectionDescription",
            "methodBadgeEyebrow",
            "methodCardBadgeLabel",
            "nextStepsSectionEyebrow",
            "nextStepsSectionTitle",
            "nextStepsSectionDescription",
          ]
        : slug === "testimonials"
          ? [
              "heroAsideEyebrow",
              "listSectionEyebrow",
              "listSectionTitle",
              "listSectionDescription",
              "nextStepsSectionEyebrow",
              "nextStepsSectionTitle",
              "nextStepsSectionDescription",
            ]
          : [
              "heroAsideEyebrow",
              "snapshotSectionEyebrow",
              "snapshotSectionTitle",
              "snapshotSectionDescription",
              "goalsSectionEyebrow",
              "goalsSectionTitle",
              "goalsSectionDescription",
              "principlesSectionEyebrow",
              "principlesSectionTitle",
              "principlesSectionDescription",
              "nextStepsSectionEyebrow",
              "nextStepsSectionTitle",
              "nextStepsSectionDescription",
            ];

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {submitState.type !== "idle" ? (
        <div className={`flex items-start gap-3 rounded-[24px] border p-5 text-sm font-medium ${submitState.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
          {submitState.type === "success" ? <CheckCircle2 className="mt-0.5 h-5 w-5" /> : <AlertCircle className="mt-0.5 h-5 w-5" />}
          <span>{submitState.message}</span>
        </div>
      ) : null}

      <section className={panelClass}>
        <h3 className="font-heading text-xl font-semibold text-brand-ink">Hero</h3>
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          <Field label="Eyebrow" value={readText(values, "eyebrow")} onChange={(value) => updateText("eyebrow", value)} />
          <Field label="Hero image" value={readText(values, "heroImage")} onChange={(value) => updateText("heroImage", value)} />
          <div className="md:col-span-2">
            <Field label="Title" value={readText(values, "title")} onChange={(value) => updateText("title", value)} />
          </div>
          <div className="md:col-span-2">
            <Field label="Description (optional)" value={readText(values, "description")} multiline onChange={(value) => updateText("description", value)} />
          </div>
        </div>
      </section>

      <section className={panelClass}>
        <h3 className="font-heading text-xl font-semibold text-brand-ink">Section copy</h3>
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          {sharedSectionFields.map((key) => (
            <Field key={key} label={key} value={readText(values, key)} onChange={(value) => updateText(key, value)} />
          ))}
        </div>
      </section>

      {slug !== "testimonials" ? (
        <StatsEditor values={arrayValue<HighlightStat>(values, "stats")} onChange={(nextValues) => updateArray("stats", nextValues)} />
      ) : null}

      {slug === "overview" ? (
        <>
          <TextListEditor title="Proof points" values={arrayValue<string>(values, "proofPoints")} onChange={(nextValues) => updateArray("proofPoints", nextValues)} addLabel="Add proof point" />
          <EvidenceCardsEditor title="Measurement cards" values={arrayValue<ImpactEvidenceCard>(values, "measurementCards")} onChange={(nextValues) => updateArray("measurementCards", nextValues)} />
          <RouteCardsEditor title="Route cards" values={arrayValue<RouteCard>(values, "routeCards")} onChange={(nextValues) => updateArray("routeCards", nextValues)} />
        </>
      ) : null}

      {slug === "reports" ? (
        <>
          <ReportsEditor values={arrayValue<ImpactReportResource>(values, "reportResources")} onChange={(nextValues) => updateArray("reportResources", nextValues)} />
          <section className={panelClass}>
            <h3 className="font-heading text-xl font-semibold text-brand-ink">Method media</h3>
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <Field
                label="Method video URL"
                value={readText(values, "methodVideoUrl")}
                onChange={(value) => updateText("methodVideoUrl", value)}
              />
              <Field
                label="Method video title"
                value={readText(values, "methodVideoTitle")}
                onChange={(value) => updateText("methodVideoTitle", value)}
              />
            </div>
          </section>
          <EvidenceCardsEditor title="Evidence cards" values={arrayValue<ImpactEvidenceCard>(values, "evidenceCards")} onChange={(nextValues) => updateArray("evidenceCards", nextValues)} />
          <TextListEditor title="Methodology points" values={arrayValue<string>(values, "methodologyPoints")} onChange={(nextValues) => updateArray("methodologyPoints", nextValues)} addLabel="Add method point" />
          <RouteCardsEditor title="Related routes" values={arrayValue<RouteCard>(values, "related")} onChange={(nextValues) => updateArray("related", nextValues)} />
        </>
      ) : null}

      {slug === "testimonials" ? (
        <>
          <FeaturedStoryEditor
            value={hasKey(values, "featuredStory") && typeof values.featuredStory === "object" && values.featuredStory ? (values.featuredStory as ImpactFeaturedStory) : defaultFeaturedStory()}
            onChange={updateFeaturedStory}
          />
          <TextListEditor title="Story themes" values={arrayValue<string>(values, "themes")} onChange={(nextValues) => updateArray("themes", nextValues)} addLabel="Add theme" />
          <StoriesEditor values={arrayValue<ImpactStory>(values, "stories")} onChange={(nextValues) => updateArray("stories", nextValues)} />
          <RouteCardsEditor title="Related routes" values={arrayValue<RouteCard>(values, "related")} onChange={(nextValues) => updateArray("related", nextValues)} />
        </>
      ) : null}

      {slug === "sdgs" ? (
        <>
          <GoalsEditor values={arrayValue<ImpactSdgGoal>(values, "goals")} onChange={(nextValues) => updateArray("goals", nextValues)} />
          <section className={panelClass}>
            <h3 className="font-heading text-xl font-semibold text-brand-ink">Principles media</h3>
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <Field
                label="Principles video URL"
                value={readText(values, "principlesVideoUrl")}
                onChange={(value) => updateText("principlesVideoUrl", value)}
              />
              <Field
                label="Principles video title"
                value={readText(values, "principlesVideoTitle")}
                onChange={(value) => updateText("principlesVideoTitle", value)}
              />
            </div>
          </section>
          <TextListEditor title="Alignment principles" values={arrayValue<string>(values, "alignmentPrinciples")} onChange={(nextValues) => updateArray("alignmentPrinciples", nextValues)} addLabel="Add principle" />
          <RouteCardsEditor title="Related routes" values={arrayValue<RouteCard>(values, "related")} onChange={(nextValues) => updateArray("related", nextValues)} />
        </>
      ) : null}

      <div className="flex items-center gap-3 rounded-[26px] border border-brand-border bg-white px-5 py-4 shadow-sm">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save impact page
        </button>
      </div>
    </form>
  );
}
