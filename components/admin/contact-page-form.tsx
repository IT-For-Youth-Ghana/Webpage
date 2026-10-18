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
  ContactChannel,
  ContactEnquiryOption,
  ContactEnquiryType,
  ContactPageContent,
  ContactResponseStep,
  HighlightStat,
  RouteCard,
} from "@/types/content";

type ApiResponse = { success?: boolean; message?: string; errors?: unknown };
type SubmitState = { type: "idle" | "success" | "error"; message: string };

type ContactPageFormProps = {
  initial: ContactPageContent;
};

const enquiryTypes: ContactEnquiryType[] = [
  "training",
  "organisation",
  "partnership",
  "donation",
  "media",
  "volunteering",
  "general",
];

const inputClass =
  "mt-2 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20";
const panelClass = "rounded-[30px] border border-brand-border bg-white p-6 shadow-sm lg:p-8";
const addButtonClass =
  "inline-flex items-center gap-2 rounded-full border border-brand-border px-4 py-2 text-sm font-semibold text-brand-ink";

const emptyStat: HighlightStat = { value: "", label: "", description: "", icon: "", iconImage: "" };
const emptyChannel: ContactChannel = { label: "", value: "", description: "", href: "" };
const emptyEnquiryOption: ContactEnquiryOption = {
  value: "general",
  label: "",
  description: "",
};
const emptyResponseStep: ContactResponseStep = { number: "", title: "", description: "" };
const emptyRouteCard: RouteCard = { href: "/", eyebrow: "", title: "", description: "" };

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

function RemoveButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="justify-self-start rounded-full border border-rose-200 p-3 text-rose-700"
      aria-label={label}
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}

export function ContactPageForm({ initial }: ContactPageFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<ContactPageContent>(() => initial);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>({ type: "idle", message: "" });

  const update = <Key extends keyof ContactPageContent>(
    key: Key,
    value: ContactPageContent[Key],
  ) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const updateStat = <Key extends keyof HighlightStat>(
    index: number,
    key: Key,
    value: HighlightStat[Key],
  ) => {
    update(
      "stats",
      values.stats.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)),
    );
  };

  const updateChannel = <Key extends keyof ContactChannel>(
    index: number,
    key: Key,
    value: ContactChannel[Key],
  ) => {
    update(
      "channels",
      values.channels.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)),
    );
  };

  const updateEnquiryOption = <Key extends keyof ContactEnquiryOption>(
    index: number,
    key: Key,
    value: ContactEnquiryOption[Key],
  ) => {
    update(
      "enquiryOptions",
      values.enquiryOptions.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)),
    );
  };

  const updateResponseStep = <Key extends keyof ContactResponseStep>(
    index: number,
    key: Key,
    value: ContactResponseStep[Key],
  ) => {
    update(
      "responseSteps",
      values.responseSteps.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)),
    );
  };

  const updateRouteCard = <Key extends keyof RouteCard>(
    index: number,
    key: Key,
    value: RouteCard[Key],
  ) => {
    update(
      "routeCards",
      values.routeCards.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)),
    );
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitState({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/admin/site-content/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const payload = (await response.json().catch(() => null)) as ApiResponse | null;

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || "We could not save the contact page.");
      }

      setSubmitState({ type: "success", message: payload.message || "Contact page updated." });
      router.refresh();
    } catch (error) {
      setSubmitState({
        type: "error",
        message: error instanceof Error ? error.message : "We could not save the contact page.",
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
        <h3 className="font-heading text-xl font-semibold text-brand-ink">Hero</h3>
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          <Field label="Eyebrow" value={values.eyebrow} onChange={(value) => update("eyebrow", value)} />
          <Field label="Hero image" value={values.heroImage} onChange={(value) => update("heroImage", value)} />
          <div className="md:col-span-2">
            <Field label="Title" value={values.title} onChange={(value) => update("title", value)} />
          </div>
          <div className="md:col-span-2">
            <Field label="Description (optional)" value={values.description} multiline onChange={(value) => update("description", value)} />
          </div>
          <div className="md:col-span-2">
            <Field label="Privacy note" value={values.privacyNote} multiline onChange={(value) => update("privacyNote", value)} />
          </div>
        </div>
      </section>

      <section className={panelClass}>
        <h3 className="font-heading text-xl font-semibold text-brand-ink">Section headings and calls to action</h3>
        <p className="mt-2 text-sm text-slate-500">Clear a field to hide that piece of copy. Image fields accept URLs or public paths only.</p>
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          <Field label="Channels eyebrow" value={values.channelsEyebrow ?? ""} onChange={(value) => update("channelsEyebrow", value)} />
          <Field label="Channels title" value={values.channelsTitle ?? ""} onChange={(value) => update("channelsTitle", value)} />
          <div className="md:col-span-2"><Field label="Channels description" value={values.channelsDescription ?? ""} multiline onChange={(value) => update("channelsDescription", value)} /></div>
          <Field label="Form eyebrow" value={values.formEyebrow ?? ""} onChange={(value) => update("formEyebrow", value)} />
          <Field label="Form title" value={values.formTitle ?? ""} onChange={(value) => update("formTitle", value)} />
          <div className="md:col-span-2"><Field label="Form description" value={values.formDescription ?? ""} multiline onChange={(value) => update("formDescription", value)} /></div>
          <Field label="Message eyebrow" value={values.messageEyebrow ?? ""} onChange={(value) => update("messageEyebrow", value)} />
          <Field label="Message title" value={values.messageTitle ?? ""} onChange={(value) => update("messageTitle", value)} />
          <div className="md:col-span-2"><Field label="Message description" value={values.messageDescription ?? ""} multiline onChange={(value) => update("messageDescription", value)} /></div>
          <Field label="Privacy box title" value={values.privacyTitle ?? ""} onChange={(value) => update("privacyTitle", value)} />
          <Field label="Routes eyebrow" value={values.routesEyebrow ?? ""} onChange={(value) => update("routesEyebrow", value)} />
          <Field label="Routes title" value={values.routesTitle ?? ""} onChange={(value) => update("routesTitle", value)} />
          <div className="md:col-span-2"><Field label="Routes description" value={values.routesDescription ?? ""} multiline onChange={(value) => update("routesDescription", value)} /></div>
          <Field label="Email CTA label" value={values.emailCtaLabel ?? ""} onChange={(value) => update("emailCtaLabel", value)} />
          <Field label="Form CTA label" value={values.formCtaLabel ?? ""} onChange={(value) => update("formCtaLabel", value)} />
        </div>
      </section>

      <section className={panelClass}>
        <h3 className="font-heading text-xl font-semibold text-brand-ink">Stats</h3>
        <div className="mt-4 space-y-4">
          {values.stats.map((stat, index) => (
            <div key={`stat-${index}`} className="grid gap-4 rounded-2xl border border-brand-border p-4 md:grid-cols-2">
              <Field label="Value" value={stat.value} onChange={(value) => updateStat(index, "value", value)} />
              <Field label="Label" value={stat.label} onChange={(value) => updateStat(index, "label", value)} />
              <Field label="Icon" value={stat.icon ?? ""} onChange={(value) => updateStat(index, "icon", value)} />
              <Field label="Icon image URL" value={stat.iconImage ?? ""} onChange={(value) => updateStat(index, "iconImage", value)} />
              <Field label="Description" value={stat.description ?? ""} onChange={(value) => updateStat(index, "description", value)} />
              <RemoveButton label="Remove stat" onClick={() => update("stats", values.stats.filter((_, itemIndex) => itemIndex !== index))} />
            </div>
          ))}
          <button type="button" onClick={() => update("stats", [...values.stats, emptyStat])} className={addButtonClass}>
            <Plus className="h-4 w-4" /> Add stat
          </button>
        </div>
      </section>

      <section className={panelClass}>
        <h3 className="font-heading text-xl font-semibold text-brand-ink">Channels</h3>
        <div className="mt-4 space-y-4">
          {values.channels.map((channel, index) => (
            <div key={`channel-${index}`} className="grid gap-4 rounded-2xl border border-brand-border p-4 md:grid-cols-2">
              <Field label="Label" value={channel.label} onChange={(value) => updateChannel(index, "label", value)} />
              <Field label="Value" value={channel.value} onChange={(value) => updateChannel(index, "value", value)} />
              <Field label="Href" value={channel.href} onChange={(value) => updateChannel(index, "href", value)} />
              <Field label="Description" value={channel.description} onChange={(value) => updateChannel(index, "description", value)} />
              <RemoveButton label="Remove channel" onClick={() => update("channels", values.channels.filter((_, itemIndex) => itemIndex !== index))} />
            </div>
          ))}
          <button type="button" onClick={() => update("channels", [...values.channels, emptyChannel])} className={addButtonClass}>
            <Plus className="h-4 w-4" /> Add channel
          </button>
        </div>
      </section>

      <section className={panelClass}>
        <h3 className="font-heading text-xl font-semibold text-brand-ink">Enquiry options</h3>
        <div className="mt-4 space-y-4">
          {values.enquiryOptions.map((option, index) => (
            <div key={`option-${index}`} className="grid gap-4 rounded-2xl border border-brand-border p-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-bold text-brand-ink">Value</label>
                <select
                  className={inputClass}
                  value={option.value}
                  onChange={(event) => updateEnquiryOption(index, "value", event.target.value as ContactEnquiryType)}
                >
                  {enquiryTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <Field label="Label" value={option.label} onChange={(value) => updateEnquiryOption(index, "label", value)} />
              <div className="md:col-span-2">
                <Field label="Description" value={option.description} multiline onChange={(value) => updateEnquiryOption(index, "description", value)} />
              </div>
              <RemoveButton label="Remove enquiry option" onClick={() => update("enquiryOptions", values.enquiryOptions.filter((_, itemIndex) => itemIndex !== index))} />
            </div>
          ))}
          <button type="button" onClick={() => update("enquiryOptions", [...values.enquiryOptions, emptyEnquiryOption])} className={addButtonClass}>
            <Plus className="h-4 w-4" /> Add option
          </button>
        </div>
      </section>

      <section className={panelClass}>
        <h3 className="font-heading text-xl font-semibold text-brand-ink">Response steps</h3>
        <div className="mt-4 space-y-4">
          {values.responseSteps.map((step, index) => (
            <div key={`step-${index}`} className="grid gap-4 rounded-2xl border border-brand-border p-4 md:grid-cols-2">
              <Field label="Number" value={step.number} onChange={(value) => updateResponseStep(index, "number", value)} />
              <Field label="Title" value={step.title} onChange={(value) => updateResponseStep(index, "title", value)} />
              <div className="md:col-span-2">
                <Field label="Description" value={step.description} multiline onChange={(value) => updateResponseStep(index, "description", value)} />
              </div>
              <RemoveButton label="Remove response step" onClick={() => update("responseSteps", values.responseSteps.filter((_, itemIndex) => itemIndex !== index))} />
            </div>
          ))}
          <button type="button" onClick={() => update("responseSteps", [...values.responseSteps, emptyResponseStep])} className={addButtonClass}>
            <Plus className="h-4 w-4" /> Add step
          </button>
        </div>
      </section>

      <section className={panelClass}>
        <h3 className="font-heading text-xl font-semibold text-brand-ink">Route cards</h3>
        <div className="mt-4 space-y-4">
          {values.routeCards.map((card, index) => (
            <div key={`route-${index}`} className="grid gap-4 rounded-2xl border border-brand-border p-4 md:grid-cols-2">
              <Field label="Eyebrow" value={card.eyebrow ?? ""} onChange={(value) => updateRouteCard(index, "eyebrow", value)} />
              <Field label="Title" value={card.title} onChange={(value) => updateRouteCard(index, "title", value)} />
              <Field label="Href" value={card.href} onChange={(value) => updateRouteCard(index, "href", value)} />
              <Field label="Description" value={card.description} onChange={(value) => updateRouteCard(index, "description", value)} />
              <RemoveButton label="Remove route card" onClick={() => update("routeCards", values.routeCards.filter((_, itemIndex) => itemIndex !== index))} />
            </div>
          ))}
          <button type="button" onClick={() => update("routeCards", [...values.routeCards, emptyRouteCard])} className={addButtonClass}>
            <Plus className="h-4 w-4" /> Add route
          </button>
        </div>
      </section>

      <div className="flex items-center gap-3 rounded-[26px] border border-brand-border bg-white px-5 py-4 shadow-sm">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save contact page
        </button>
      </div>
    </form>
  );
}
