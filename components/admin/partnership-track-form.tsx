"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowDown, ArrowUp, CheckCircle2, Loader2, Plus, Save, Trash2 } from "lucide-react";

import type {
  HighlightStat,
  PartnershipFaq,
  PartnershipFocusCard,
  PartnershipProcessStep,
  PartnershipScenario,
  PartnershipTrackPage,
  RouteCard,
} from "@/types/content";

type ApiResponse = { success?: boolean; message?: string; errors?: unknown };
type SubmitState = { type: "idle" | "success" | "error"; message: string };

type Props = { mode: "create" | "edit"; initial?: PartnershipTrackPage };

const input =
  "mt-2 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20";

const emptyTrack: PartnershipTrackPage = {
  slug: "",
  eyebrow: "Partner track",
  title: "",
  description: "",
  tagline: "",
  heroImage: "",
  stats: [],
  focusCards: [],
  howItWorks: [],
  scenarios: [],
  faqs: [],
  contactCta: {
    heading: "",
    description: "",
    email: "",
    primary: { label: "", href: "/contact" },
    secondary: { label: "", href: "/contact" },
  },
  related: [],
  relatedSectionEyebrow: "Related routes",
};

export function PartnershipTrackForm({ mode, initial }: Props) {
  const router = useRouter();
  const [values, setValues] = useState<PartnershipTrackPage>(() => initial ?? emptyTrack);

  const [stats, setStats] = useState<HighlightStat[]>(values.stats ?? []);
  const [focusCards, setFocusCards] = useState<PartnershipFocusCard[]>(values.focusCards ?? []);
  const [howItWorks, setHowItWorks] = useState<PartnershipProcessStep[]>(values.howItWorks ?? []);
  const [scenarios, setScenarios] = useState<PartnershipScenario[]>(values.scenarios ?? []);
  const [faqs, setFaqs] = useState<PartnershipFaq[]>(values.faqs ?? []);
  const [related, setRelated] = useState<RouteCard[]>(values.related ?? []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>({ type: "idle", message: "" });

  const update = <Key extends keyof PartnershipTrackPage>(
    key: Key,
    value: PartnershipTrackPage[Key],
  ) => setValues((v) => ({ ...v, [key]: value }));

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitState({ type: "idle", message: "" });
    try {
      const payload = { ...values, stats, focusCards, howItWorks, scenarios, faqs, related };
      const endpoint = mode === "edit" ? `/api/admin/partnerships/${values.slug}` : "/api/admin/partnerships";
      const method = mode === "edit" ? "PUT" : "POST";
      const body = mode === "edit" ? payload : { ...payload, slug: values.slug };
      const resp = await fetch(endpoint, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = (await resp.json().catch(() => null)) as ApiResponse | null;
      if (!resp.ok || !data?.success) {
        throw new Error(data?.message || "We couldn't save this partner track.");
      }
      setSubmitState({ type: "success", message: data.message || "Partner track saved." });
      router.push("/admin/partner-with-us");
      router.refresh();
    } catch (err) {
      setSubmitState({ type: "error", message: err instanceof Error ? err.message : "We couldn't save this partner track." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDelete = async () => {
    if (mode !== "edit" || !values.slug) return;
    const confirmed = window.confirm("Delete this partner track? This cannot be undone.");
    if (!confirmed) return;
    setIsDeleting(true);
    setSubmitState({ type: "idle", message: "" });
    try {
      const resp = await fetch(`/api/admin/partnerships/${values.slug}`, { method: "DELETE" });
      const data = (await resp.json().catch(() => null)) as ApiResponse | null;
      if (!resp.ok || !data?.success) {
        throw new Error(data?.message || "We couldn't delete this track.");
      }
      router.push("/admin/partner-with-us");
      router.refresh();
    } catch (err) {
      setSubmitState({ type: "error", message: err instanceof Error ? err.message : "We couldn't delete this track." });
    } finally {
      setIsDeleting(false);
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

      <section className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm lg:p-8">
        <h3 className="font-heading text-xl font-semibold text-brand-ink">Core</h3>
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          <div><label className="text-sm font-bold text-brand-ink">Slug</label><input className={input} required={mode === "create"} disabled={mode === "edit"} value={values.slug} onChange={(e) => update("slug", e.target.value)} placeholder="e.g. educational" /></div>
          <div><label className="text-sm font-bold text-brand-ink">Eyebrow</label><input className={input} value={values.eyebrow ?? ""} onChange={(e) => update("eyebrow", e.target.value)} /></div>
          <div className="md:col-span-2"><label className="text-sm font-bold text-brand-ink">Title</label><input className={input} value={values.title} onChange={(e) => update("title", e.target.value)} /></div>
          <div className="md:col-span-2"><label className="text-sm font-bold text-brand-ink">Description (optional)</label><textarea className={input + " h-28"} value={values.description} onChange={(e) => update("description", e.target.value)} /></div>
          <div><label className="text-sm font-bold text-brand-ink">Tagline (optional)</label><input className={input} value={values.tagline ?? ""} onChange={(e) => update("tagline", e.target.value)} /></div>
          <div><label className="text-sm font-bold text-brand-ink">Hero image</label><input className={input} value={values.heroImage ?? ""} onChange={(e) => update("heroImage", e.target.value)} /></div>
        </div>
      </section>

      <section className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm lg:p-8">
        <h3 className="font-heading text-xl font-semibold text-brand-ink">Overview media</h3>
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          <div><label className="text-sm font-bold text-brand-ink">Overview video URL</label><input className={input} value={values.overviewVideoUrl ?? ""} onChange={(e) => update("overviewVideoUrl", e.target.value)} placeholder="https://..." /></div>
          <div><label className="text-sm font-bold text-brand-ink">Overview video title</label><input className={input} value={values.overviewVideoTitle ?? ""} onChange={(e) => update("overviewVideoTitle", e.target.value)} placeholder="Optional video title" /></div>
        </div>
      </section>

      <section className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm lg:p-8">
        <h3 className="font-heading text-xl font-semibold text-brand-ink">Section headings and labels</h3>
        <p className="mt-2 text-sm text-slate-500">These fields control every piece of framing copy shown around the seeded collections.</p>
        <div className="mt-4 space-y-6">
          {([
            ["Overview", "overviewSectionEyebrow", "overviewSectionTitle", "overviewSectionDescription"],
            ["How it works", "howItWorksSectionEyebrow", "howItWorksSectionTitle", "howItWorksSectionDescription"],
            ["Example scenarios", "scenariosSectionEyebrow", "scenariosSectionTitle", "scenariosSectionDescription"],
            ["FAQs", "faqsSectionEyebrow", "faqsSectionTitle", "faqsSectionDescription"],
            ["Related routes", "relatedSectionEyebrow", "relatedSectionTitle", "relatedSectionDescription"],
          ] as const).map(([label, eyebrowKey, titleKey, descriptionKey]) => (
            <fieldset key={label} className="grid gap-4 rounded-2xl border border-brand-border p-4 md:grid-cols-2">
              <legend className="px-2 text-sm font-bold text-brand-ink">{label}</legend>
              <div><label className="text-sm font-bold text-brand-ink">Eyebrow</label><input className={input} value={values[eyebrowKey] ?? ""} onChange={(e) => update(eyebrowKey, e.target.value)} /></div>
              <div><label className="text-sm font-bold text-brand-ink">Title</label><input className={input} value={values[titleKey] ?? ""} onChange={(e) => update(titleKey, e.target.value)} /></div>
              <div className="md:col-span-2"><label className="text-sm font-bold text-brand-ink">Description</label><textarea className={input + " h-24"} value={values[descriptionKey] ?? ""} onChange={(e) => update(descriptionKey, e.target.value)} /></div>
            </fieldset>
          ))}
          <div className="grid gap-4 md:grid-cols-3">
            <div><label className="text-sm font-bold text-brand-ink">Overview card badge</label><input className={input} value={values.overviewCardBadgeLabel ?? ""} onChange={(e) => update("overviewCardBadgeLabel", e.target.value)} /></div>
            <div><label className="text-sm font-bold text-brand-ink">Contact eyebrow</label><input className={input} value={values.contactSectionEyebrow ?? ""} onChange={(e) => update("contactSectionEyebrow", e.target.value)} /></div>
            <div><label className="text-sm font-bold text-brand-ink">Snapshot label</label><input className={input} value={values.snapshotEyebrow ?? ""} onChange={(e) => update("snapshotEyebrow", e.target.value)} /></div>
          </div>
        </div>
      </section>

      <section className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm lg:p-8">
        <h3 className="font-heading text-xl font-semibold text-brand-ink">Stats</h3>
        <div className="mt-4 space-y-4">
          {stats.map((s, i) => (
            <div key={i} className="grid items-end gap-4 rounded-2xl border border-brand-border p-4 md:grid-cols-[1fr_1fr_1fr_1fr_auto_auto]">
              <div><label className="text-sm font-bold text-brand-ink">Value</label><input className={input} value={s.value ?? ""} onChange={(e) => setStats((arr) => arr.map((it, idx) => idx === i ? { ...it, value: e.target.value } : it))} /></div>
              <div><label className="text-sm font-bold text-brand-ink">Label</label><input className={input} value={s.label ?? ""} onChange={(e) => setStats((arr) => arr.map((it, idx) => idx === i ? { ...it, label: e.target.value } : it))} /></div>
              <div><label className="text-sm font-bold text-brand-ink">Icon</label><input className={input} value={s.icon ?? ""} onChange={(e) => setStats((arr) => arr.map((it, idx) => idx === i ? { ...it, icon: e.target.value } : it))} /></div>
              <div><label className="text-sm font-bold text-brand-ink">Icon image URL</label><input className={input} value={s.iconImage ?? ""} onChange={(e) => setStats((arr) => arr.map((it, idx) => idx === i ? { ...it, iconImage: e.target.value } : it))} /></div>
              <button type="button" onClick={() => setStats((arr) => (i <= 0 ? arr : ((n) => ([n[i-1], n[i]] = [n[i], n[i-1]], n))([...arr])))} className="rounded-full border border-brand-border p-2 text-brand-ink"><ArrowUp className="h-4 w-4" /></button>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setStats((arr) => (i >= arr.length-1 ? arr : ((n) => ([n[i], n[i+1]] = [n[i+1], n[i]], n))([...arr])))} className="rounded-full border border-brand-border p-2 text-brand-ink"><ArrowDown className="h-4 w-4" /></button>
                <button type="button" onClick={() => setStats((arr) => arr.filter((_it, idx) => idx !== i))} className="rounded-full border border-rose-200 p-2 text-rose-700"><Trash2 className="h-4 w-4" /></button>
              </div>
              <div className="md:col-span-3"><label className="text-sm font-bold text-brand-ink">Description</label><input className={input} value={s.description ?? ""} onChange={(e) => setStats((arr) => arr.map((it, idx) => idx === i ? { ...it, description: e.target.value } : it))} /></div>
            </div>
          ))}
          <button type="button" onClick={() => setStats((arr) => [...arr, { value: "", label: "", description: "", icon: "", iconImage: "" }])} className="inline-flex items-center gap-2 rounded-full border border-brand-border px-4 py-2 text-sm font-semibold text-brand-ink"><Plus className="h-4 w-4" /> Add stat</button>
        </div>
      </section>

      <section className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm lg:p-8">
        <h3 className="font-heading text-xl font-semibold text-brand-ink">Focus cards</h3>
        <div className="mt-4 space-y-4">
          {focusCards.map((c, i) => (
            <div key={i} className="grid items-end gap-4 rounded-2xl border border-brand-border p-4 md:grid-cols-[1fr_1fr_auto]">
              <div><label className="text-sm font-bold text-brand-ink">Title</label><input className={input} value={c.title ?? ""} onChange={(e) => setFocusCards((arr) => arr.map((it, idx) => idx === i ? { ...it, title: e.target.value } : it))} /></div>
              <div><label className="text-sm font-bold text-brand-ink">Description</label><input className={input} value={c.description ?? ""} onChange={(e) => setFocusCards((arr) => arr.map((it, idx) => idx === i ? { ...it, description: e.target.value } : it))} /></div>
              <div className="flex items-center gap-2"><button type="button" onClick={() => setFocusCards((arr) => arr.filter((_it, idx) => idx !== i))} className="rounded-full border border-rose-200 p-2 text-rose-700"><Trash2 className="h-4 w-4" /></button></div>
              <div className="md:col-span-3 grid gap-4 md:grid-cols-2"><div><label className="text-sm font-bold text-brand-ink">Icon</label><input className={input} value={c.icon ?? ""} onChange={(e) => setFocusCards((arr) => arr.map((it, idx) => idx === i ? { ...it, icon: e.target.value } : it))} /></div><div><label className="text-sm font-bold text-brand-ink">Icon image URL</label><input className={input} value={c.iconImage ?? ""} onChange={(e) => setFocusCards((arr) => arr.map((it, idx) => idx === i ? { ...it, iconImage: e.target.value } : it))} /></div></div>
              <div className="md:col-span-3"><label className="text-sm font-bold text-brand-ink">Bullets (one per line)</label><textarea className={input + " h-28"} value={(c.bullets ?? []).join("\n")} onChange={(e) => setFocusCards((arr) => arr.map((it, idx) => idx === i ? { ...it, bullets: e.target.value.split("\n").filter(Boolean) } : it))} /></div>
            </div>
          ))}
          <button type="button" onClick={() => setFocusCards((arr) => [...arr, { title: "", description: "", icon: "", iconImage: "", bullets: [] }])} className="inline-flex items-center gap-2 rounded-full border border-brand-border px-4 py-2 text-sm font-semibold text-brand-ink"><Plus className="h-4 w-4" /> Add card</button>
        </div>
      </section>

      <section className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm lg:p-8">
        <h3 className="font-heading text-xl font-semibold text-brand-ink">How it works</h3>
        <div className="mt-4 space-y-4">
          {howItWorks.map((h, i) => (
            <div key={i} className="grid items-end gap-4 rounded-2xl border border-brand-border p-4 md:grid-cols-[0.3fr_1fr_1fr_0.6fr_auto]">
              <div><label className="text-sm font-bold text-brand-ink">Step #</label><input className={input} value={h.number ?? ""} onChange={(e) => setHowItWorks((arr) => arr.map((it, idx) => idx === i ? { ...it, number: e.target.value } : it))} /></div>
              <div><label className="text-sm font-bold text-brand-ink">Title</label><input className={input} value={h.title ?? ""} onChange={(e) => setHowItWorks((arr) => arr.map((it, idx) => idx === i ? { ...it, title: e.target.value } : it))} /></div>
              <div><label className="text-sm font-bold text-brand-ink">Description</label><input className={input} value={h.description ?? ""} onChange={(e) => setHowItWorks((arr) => arr.map((it, idx) => idx === i ? { ...it, description: e.target.value } : it))} /></div>
              <div className="grid gap-4 md:grid-cols-2"><div><label className="text-sm font-bold text-brand-ink">Icon</label><input className={input} value={h.icon ?? ""} onChange={(e) => setHowItWorks((arr) => arr.map((it, idx) => idx === i ? { ...it, icon: e.target.value } : it))} /></div><div><label className="text-sm font-bold text-brand-ink">Icon image URL</label><input className={input} value={h.iconImage ?? ""} onChange={(e) => setHowItWorks((arr) => arr.map((it, idx) => idx === i ? { ...it, iconImage: e.target.value } : it))} /></div></div>
              <div className="flex items-center gap-2"><button type="button" onClick={() => setHowItWorks((arr) => arr.filter((_it, idx) => idx !== i))} className="rounded-full border border-rose-200 p-2 text-rose-700"><Trash2 className="h-4 w-4" /></button></div>
            </div>
          ))}
          <button type="button" onClick={() => setHowItWorks((arr) => [...arr, { number: "", title: "", description: "", icon: "", iconImage: "" }])} className="inline-flex items-center gap-2 rounded-full border border-brand-border px-4 py-2 text-sm font-semibold text-brand-ink"><Plus className="h-4 w-4" /> Add step</button>
        </div>
      </section>

      <section className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm lg:p-8">
        <h3 className="font-heading text-xl font-semibold text-brand-ink">Scenarios</h3>
        <div className="mt-4 space-y-4">
          {scenarios.map((sc, i) => (
            <div key={i} className="space-y-3 rounded-2xl border border-brand-border p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div><label className="text-sm font-bold text-brand-ink">Title</label><input className={input} value={sc.title ?? ""} onChange={(e) => setScenarios((arr) => arr.map((it, idx) => idx === i ? { ...it, title: e.target.value } : it))} /></div>
                <div><label className="text-sm font-bold text-brand-ink">Partner type</label><input className={input} value={sc.partnerType ?? ""} onChange={(e) => setScenarios((arr) => arr.map((it, idx) => idx === i ? { ...it, partnerType: e.target.value } : it))} /></div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="md:col-span-1"><label className="text-sm font-bold text-brand-ink">Highlight</label><input className={input} value={sc.highlight ?? ""} onChange={(e) => setScenarios((arr) => arr.map((it, idx) => idx === i ? { ...it, highlight: e.target.value } : it))} /></div>
                <div className="md:col-span-1"><label className="text-sm font-bold text-brand-ink">Summary</label><input className={input} value={sc.summary ?? ""} onChange={(e) => setScenarios((arr) => arr.map((it, idx) => idx === i ? { ...it, summary: e.target.value } : it))} /></div>
                <div className="md:col-span-1"><label className="text-sm font-bold text-brand-ink">Outcome</label><input className={input} value={sc.outcome ?? ""} onChange={(e) => setScenarios((arr) => arr.map((it, idx) => idx === i ? { ...it, outcome: e.target.value } : it))} /></div>
              </div>
              <div className="flex items-center gap-2"><button type="button" onClick={() => setScenarios((arr) => arr.filter((_it, idx) => idx !== i))} className="rounded-full border border-rose-200 p-2 text-rose-700"><Trash2 className="h-4 w-4" /></button></div>
            </div>
          ))}
          <button type="button" onClick={() => setScenarios((arr) => [...arr, { title: "", partnerType: "", summary: "", outcome: "", highlight: "" }])} className="inline-flex items-center gap-2 rounded-full border border-brand-border px-4 py-2 text-sm font-semibold text-brand-ink"><Plus className="h-4 w-4" /> Add scenario</button>
        </div>
      </section>

      <section className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm lg:p-8">
        <h3 className="font-heading text-xl font-semibold text-brand-ink">FAQs</h3>
        <div className="mt-4 space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="grid items-end gap-4 rounded-2xl border border-brand-border p-4 md:grid-cols-[1fr_2fr_auto]">
              <div><label className="text-sm font-bold text-brand-ink">Question</label><input className={input} value={f.question ?? ""} onChange={(e) => setFaqs((arr) => arr.map((it, idx) => idx === i ? { ...it, question: e.target.value } : it))} /></div>
              <div><label className="text-sm font-bold text-brand-ink">Answer</label><input className={input} value={f.answer ?? ""} onChange={(e) => setFaqs((arr) => arr.map((it, idx) => idx === i ? { ...it, answer: e.target.value } : it))} /></div>
              <div className="flex items-center gap-2"><button type="button" onClick={() => setFaqs((arr) => arr.filter((_it, idx) => idx !== i))} className="rounded-full border border-rose-200 p-2 text-rose-700"><Trash2 className="h-4 w-4" /></button></div>
            </div>
          ))}
          <button type="button" onClick={() => setFaqs((arr) => [...arr, { question: "", answer: "" }])} className="inline-flex items-center gap-2 rounded-full border border-brand-border px-4 py-2 text-sm font-semibold text-brand-ink"><Plus className="h-4 w-4" /> Add FAQ</button>
        </div>
      </section>

      <section className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm lg:p-8">
        <h3 className="font-heading text-xl font-semibold text-brand-ink">Contact CTA</h3>
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2"><label className="text-sm font-bold text-brand-ink">Heading</label><input className={input} value={values.contactCta?.heading ?? ""} onChange={(e) => update("contactCta", { ...values.contactCta, heading: e.target.value })} /></div>
          <div className="md:col-span-2"><label className="text-sm font-bold text-brand-ink">Description</label><textarea className={input + " h-24"} value={values.contactCta?.description ?? ""} onChange={(e) => update("contactCta", { ...values.contactCta, description: e.target.value })} /></div>
          <div><label className="text-sm font-bold text-brand-ink">Email</label><input className={input} value={values.contactCta?.email ?? ""} onChange={(e) => update("contactCta", { ...values.contactCta, email: e.target.value })} /></div>
        </div>
      </section>

      <section className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm lg:p-8">
        <h3 className="font-heading text-xl font-semibold text-brand-ink">Related routes</h3>
        <div className="mt-4 space-y-4">
          {related.map((r, i) => (
            <div key={i} className="grid items-end gap-4 rounded-2xl border border-brand-border p-4 md:grid-cols-[1fr_1fr_1fr_auto]">
              <div><label className="text-sm font-bold text-brand-ink">Eyebrow</label><input className={input} value={r.eyebrow ?? ""} onChange={(e) => setRelated((arr) => arr.map((it, idx) => idx === i ? { ...it, eyebrow: e.target.value } : it))} /></div>
              <div><label className="text-sm font-bold text-brand-ink">Title</label><input className={input} value={r.title ?? ""} onChange={(e) => setRelated((arr) => arr.map((it, idx) => idx === i ? { ...it, title: e.target.value } : it))} /></div>
              <div><label className="text-sm font-bold text-brand-ink">Href</label><input className={input} value={r.href ?? ""} onChange={(e) => setRelated((arr) => arr.map((it, idx) => idx === i ? { ...it, href: e.target.value } : it))} /></div>
              <div className="flex items-center gap-2"><button type="button" onClick={() => setRelated((arr) => arr.filter((_it, idx) => idx !== i))} className="rounded-full border border-rose-200 p-2 text-rose-700"><Trash2 className="h-4 w-4" /></button></div>
              <div className="md:col-span-3"><label className="text-sm font-bold text-brand-ink">Description</label><input className={input} value={r.description ?? ""} onChange={(e) => setRelated((arr) => arr.map((it, idx) => idx === i ? { ...it, description: e.target.value } : it))} /></div>
            </div>
          ))}
          <button type="button" onClick={() => setRelated((arr) => [...arr, { href: "", eyebrow: "", title: "", description: "" }])} className="inline-flex items-center gap-2 rounded-full border border-brand-border px-4 py-2 text-sm font-semibold text-brand-ink"><Plus className="h-4 w-4" /> Add related</button>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3 rounded-[26px] border border-brand-border bg-white px-5 py-4 shadow-sm">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {mode === "edit" ? "Update track" : "Create track"}
        </button>
        {mode === "edit" ? (
          <button
            type="button"
            onClick={onDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            Delete track
          </button>
        ) : null}
      </div>
    </form>
  );
}
