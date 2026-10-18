"use client";

import { FormEvent, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2, Plus, Save, Trash2 } from "lucide-react";

import type {
  ActionLink,
  ContentBlock,
  DepartmentContact,
  DepartmentProcessStep,
  DepartmentProfile,
  DepartmentResource,
  DepartmentStatus,
  HighlightStat,
} from "@/types/content";

type DepartmentFormMode = "create" | "edit";

type DepartmentFormValues = Omit<DepartmentProfile, "id" | "order"> & {
  order: string;
};

type ApiResponse = {
  success?: boolean;
  message?: string;
  errors?: {
    fieldErrors?: Partial<Record<keyof DepartmentFormValues, string[]>>;
  };
};

type SubmitState = {
  type: "idle" | "success" | "error";
  message: string;
};

type DepartmentFormProps = {
  mode: DepartmentFormMode;
  department?: DepartmentProfile;
};

const inputClassName =
  "mt-2 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20";

const textareaClassName =
  "mt-2 min-h-28 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm leading-7 text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20";

const emptyStat = (): HighlightStat => ({ value: "", label: "", description: "", icon: "", iconImage: "" });
const emptyService = (): ContentBlock => ({ title: "", body: "", bullets: [] });
const emptyWorkflow = (): DepartmentProcessStep => ({ title: "", description: "" });
const emptyResource = (): DepartmentResource => ({ label: "", href: "", description: "" });
const emptyCta = (): ActionLink => ({ label: "", href: "" });

function fromLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function toLines(value: string[]) {
  return value.join("\n");
}

function getInitialValues(department?: DepartmentProfile): DepartmentFormValues {
  return {
    slug: department?.slug ?? "",
    eyebrow: department?.eyebrow ?? "Department",
    title: department?.title ?? "",
    summary: department?.summary ?? "",
    description: department?.description ?? "",
    intro: department?.intro ?? "",
    mission: department?.mission ?? "",
    heroImage: department?.heroImage ?? "",
    icon: department?.icon ?? "",
    iconImage: department?.iconImage ?? "",
    color: department?.color ?? "#1E72BA",
    responsibilities: department?.responsibilities ?? [""],
    services: department?.services?.length ? department.services : [emptyService()],
    workflows: department?.workflows?.length ? department.workflows : [emptyWorkflow()],
    priorities: department?.priorities ?? [],
    stats: department?.stats?.length ? department.stats : [emptyStat()],
    teamMemberIds: department?.teamMemberIds ?? [],
    resources: department?.resources?.length ? department.resources : [emptyResource()],
    contact: department?.contact ?? {},
    ctas: department?.ctas?.length ? department.ctas : [emptyCta()],
    featured: department?.featured ?? false,
    status: department?.status ?? "draft",
    order: typeof department?.order === "number" ? String(department.order) : "0",
  };
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-2 flex items-center gap-2 text-sm font-medium text-rose-600">
      <AlertCircle className="h-4 w-4" />
      {message}
    </p>
  );
}

export function DepartmentForm({ mode, department }: DepartmentFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<DepartmentFormValues>(() => getInitialValues(department));
  const [fieldErrors, setFieldErrors] = useState<ApiResponse["errors"]>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>({ type: "idle", message: "" });

  const getFieldError = (field: keyof DepartmentFormValues) => fieldErrors?.fieldErrors?.[field]?.[0];

  const updateValue = <Field extends keyof DepartmentFormValues>(
    field: Field,
    value: DepartmentFormValues[Field],
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({
      ...current,
      fieldErrors: { ...current?.fieldErrors, [field]: undefined },
    }));
  };

  const payload = useMemo(
    () => ({
      ...values,
      responsibilities: values.responsibilities.filter(Boolean),
      priorities: values.priorities.filter(Boolean),
      teamMemberIds: values.teamMemberIds.filter(Boolean),
      services: values.services.filter((item) => item.title.trim() && item.body.trim()),
      workflows: values.workflows.filter((item) => item.title.trim() && item.description.trim()),
      stats: values.stats.filter((item) => item.value.trim() && item.label.trim()),
      resources: values.resources.filter((item) => item.label.trim() && item.href.trim()),
      ctas: values.ctas.filter((item) => item.label.trim() && item.href.trim()),
      order: values.order,
    }),
    [values],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitState({ type: "idle", message: "" });
    setFieldErrors({});

    const endpoint =
      mode === "edit" && department
        ? `/api/admin/departments/${department.id}`
        : "/api/admin/departments";

    try {
      const response = await fetch(endpoint, {
        method: mode === "edit" ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json().catch(() => null)) as ApiResponse | null;

      if (!response.ok || !result?.success) {
        setFieldErrors(result?.errors ?? {});
        throw new Error(result?.message || "We could not save this department right now.");
      }

      setSubmitState({ type: "success", message: result.message || "Department saved." });
      router.push("/admin/departments");
      router.refresh();
    } catch (error) {
      setSubmitState({
        type: "error",
        message: error instanceof Error ? error.message : "We could not save this department right now.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!department) return;
    if (!window.confirm("Delete this department now? This cannot be undone.")) return;

    setIsDeleting(true);
    setSubmitState({ type: "idle", message: "" });

    try {
      const response = await fetch(`/api/admin/departments/${department.id}`, { method: "DELETE" });
      const result = (await response.json().catch(() => null)) as ApiResponse | null;

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || "We could not delete this department right now.");
      }

      router.push("/admin/departments");
      router.refresh();
    } catch (error) {
      setSubmitState({
        type: "error",
        message: error instanceof Error ? error.message : "We could not delete this department right now.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const updateService = <Key extends keyof ContentBlock>(index: number, key: Key, value: ContentBlock[Key]) =>
    updateValue(
      "services",
      values.services.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)),
    );

  const updateWorkflow = <Key extends keyof DepartmentProcessStep>(
    index: number,
    key: Key,
    value: DepartmentProcessStep[Key],
  ) =>
    updateValue(
      "workflows",
      values.workflows.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)),
    );

  const updateStat = <Key extends keyof HighlightStat>(index: number, key: Key, value: HighlightStat[Key]) =>
    updateValue(
      "stats",
      values.stats.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)),
    );

  const updateResource = <Key extends keyof DepartmentResource>(
    index: number,
    key: Key,
    value: DepartmentResource[Key],
  ) =>
    updateValue(
      "resources",
      values.resources.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)),
    );

  const updateCta = <Key extends keyof ActionLink>(index: number, key: Key, value: ActionLink[Key]) =>
    updateValue(
      "ctas",
      values.ctas.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)),
    );

  const updateContact = <Key extends keyof DepartmentContact>(key: Key, value: DepartmentContact[Key]) =>
    updateValue("contact", { ...values.contact, [key]: value });

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
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

      <div className="grid gap-8 lg:grid-cols-[0.68fr_0.32fr]">
        <section className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm lg:p-8">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-accent">Department</p>
            <h2 className="mt-2 font-heading text-2xl font-bold text-brand-ink">Public page content</h2>
          </div>

          <div className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="title" className="text-sm font-bold text-brand-ink">Title</label>
                <input id="title" required value={values.title} onChange={(event) => updateValue("title", event.target.value)} className={inputClassName} />
                <FieldError message={getFieldError("title")} />
              </div>
              <div>
                <label htmlFor="slug" className="text-sm font-bold text-brand-ink">Slug</label>
                <input id="slug" required value={values.slug} onChange={(event) => updateValue("slug", event.target.value)} className={inputClassName} placeholder="programmes" />
                <FieldError message={getFieldError("slug")} />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label htmlFor="eyebrow" className="text-sm font-bold text-brand-ink">Eyebrow</label>
                <input id="eyebrow" value={values.eyebrow} onChange={(event) => updateValue("eyebrow", event.target.value)} className={inputClassName} />
              </div>
              <div>
                <label htmlFor="icon" className="text-sm font-bold text-brand-ink">Icon</label>
                <input id="icon" value={values.icon ?? ""} onChange={(event) => updateValue("icon", event.target.value)} className={inputClassName} placeholder="🎓" />
              </div>
              <div>
                <label htmlFor="iconImage" className="text-sm font-bold text-brand-ink">Icon image URL</label>
                <input id="iconImage" value={values.iconImage ?? ""} onChange={(event) => updateValue("iconImage", event.target.value)} className={inputClassName} placeholder="https://.../icon.png" />
              </div>
              <div>
                <label htmlFor="color" className="text-sm font-bold text-brand-ink">Accent color</label>
                <input id="color" value={values.color ?? ""} onChange={(event) => updateValue("color", event.target.value)} className={inputClassName} placeholder="#1E72BA" />
              </div>
            </div>

            <div>
              <label htmlFor="summary" className="text-sm font-bold text-brand-ink">Summary (optional)</label>
              <input id="summary" value={values.summary} onChange={(event) => updateValue("summary", event.target.value)} className={inputClassName} />
              <FieldError message={getFieldError("summary")} />
            </div>

            <div>
              <label htmlFor="description" className="text-sm font-bold text-brand-ink">Description (optional)</label>
              <textarea id="description" value={values.description} onChange={(event) => updateValue("description", event.target.value)} className={textareaClassName} />
              <FieldError message={getFieldError("description")} />
            </div>

            <div>
              <label htmlFor="intro" className="text-sm font-bold text-brand-ink">Intro (optional)</label>
              <textarea id="intro" value={values.intro} onChange={(event) => updateValue("intro", event.target.value)} className={textareaClassName} />
            </div>

            <div>
              <label htmlFor="mission" className="text-sm font-bold text-brand-ink">Mission</label>
              <textarea id="mission" required value={values.mission} onChange={(event) => updateValue("mission", event.target.value)} className={textareaClassName} />
            </div>

            <div>
              <label htmlFor="heroImage" className="text-sm font-bold text-brand-ink">Hero image URL</label>
              <input id="heroImage" value={values.heroImage ?? ""} onChange={(event) => updateValue("heroImage", event.target.value)} className={inputClassName} />
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label htmlFor="status" className="text-sm font-bold text-brand-ink">Status</label>
                <select id="status" value={values.status} onChange={(event) => updateValue("status", event.target.value as DepartmentStatus)} className={inputClassName}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div>
                <label htmlFor="order" className="text-sm font-bold text-brand-ink">Order</label>
                <input id="order" type="number" value={values.order} onChange={(event) => updateValue("order", event.target.value)} className={inputClassName} />
              </div>
              <label className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-brand-border bg-brand-mist px-4 py-3 text-sm font-medium text-brand-ink">
                <input type="checkbox" checked={values.featured} onChange={(event) => updateValue("featured", event.target.checked)} className="h-4 w-4 rounded border-slate-300" />
                Featured department
              </label>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm">
            <h3 className="font-heading text-xl font-semibold text-brand-ink">Lists</h3>
            <div className="mt-5 grid gap-5">
              <div>
                <label className="text-sm font-bold text-brand-ink">Responsibilities</label>
                <textarea value={toLines(values.responsibilities)} onChange={(event) => updateValue("responsibilities", fromLines(event.target.value))} className={textareaClassName} />
              </div>
              <div>
                <label className="text-sm font-bold text-brand-ink">Priorities</label>
                <textarea value={toLines(values.priorities)} onChange={(event) => updateValue("priorities", fromLines(event.target.value))} className={textareaClassName} />
              </div>
              <div>
                <label className="text-sm font-bold text-brand-ink">Team member IDs</label>
                <textarea value={toLines(values.teamMemberIds)} onChange={(event) => updateValue("teamMemberIds", fromLines(event.target.value))} className={textareaClassName} />
              </div>
            </div>
          </section>

          <section className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm">
            <h3 className="font-heading text-xl font-semibold text-brand-ink">Contact</h3>
            <div className="mt-5 grid gap-4">
              <input value={values.contact?.name ?? ""} onChange={(event) => updateContact("name", event.target.value)} className={inputClassName} placeholder="Contact name" />
              <input value={values.contact?.role ?? ""} onChange={(event) => updateContact("role", event.target.value)} className={inputClassName} placeholder="Contact role" />
              <input value={values.contact?.email ?? ""} onChange={(event) => updateContact("email", event.target.value)} className={inputClassName} placeholder="email@example.com" />
            </div>
          </section>
        </aside>
      </div>

      <RepeatableSection title="Services" onAdd={() => updateValue("services", [...values.services, emptyService()])}>
        {values.services.map((service, index) => (
          <div key={index} className="rounded-2xl border border-brand-border p-4">
            <div className="grid gap-4 md:grid-cols-2">
              <input value={service.title} onChange={(event) => updateService(index, "title", event.target.value)} className={inputClassName} placeholder="Service title" />
              <input value={toLines(service.bullets ?? [])} onChange={(event) => updateService(index, "bullets", fromLines(event.target.value))} className={inputClassName} placeholder="Bullets, one per line" />
            </div>
            <textarea value={service.body} onChange={(event) => updateService(index, "body", event.target.value)} className={textareaClassName} placeholder="Service description" />
            <RemoveButton onClick={() => updateValue("services", values.services.filter((_, itemIndex) => itemIndex !== index))} />
          </div>
        ))}
      </RepeatableSection>

      <RepeatableSection title="Workflow steps" onAdd={() => updateValue("workflows", [...values.workflows, emptyWorkflow()])}>
        {values.workflows.map((step, index) => (
          <div key={index} className="grid gap-4 rounded-2xl border border-brand-border p-4 md:grid-cols-[0.35fr_0.65fr]">
            <input value={step.title} onChange={(event) => updateWorkflow(index, "title", event.target.value)} className={inputClassName} placeholder="Step title" />
            <input value={step.description} onChange={(event) => updateWorkflow(index, "description", event.target.value)} className={inputClassName} placeholder="Step description" />
            <RemoveButton onClick={() => updateValue("workflows", values.workflows.filter((_, itemIndex) => itemIndex !== index))} />
          </div>
        ))}
      </RepeatableSection>

      <RepeatableSection title="Stats" onAdd={() => updateValue("stats", [...values.stats, emptyStat()])}>
        {values.stats.map((stat, index) => (
          <div key={index} className="grid gap-4 rounded-2xl border border-brand-border p-4 md:grid-cols-5">
            <input value={stat.value} onChange={(event) => updateStat(index, "value", event.target.value)} className={inputClassName} placeholder="Value" />
            <input value={stat.label} onChange={(event) => updateStat(index, "label", event.target.value)} className={inputClassName} placeholder="Label" />
            <input value={stat.description ?? ""} onChange={(event) => updateStat(index, "description", event.target.value)} className={inputClassName} placeholder="Description" />
            <input value={stat.icon ?? ""} onChange={(event) => updateStat(index, "icon", event.target.value)} className={inputClassName} placeholder="Icon" />
            <input value={stat.iconImage ?? ""} onChange={(event) => updateStat(index, "iconImage", event.target.value)} className={inputClassName} placeholder="Icon image URL" />
            <RemoveButton onClick={() => updateValue("stats", values.stats.filter((_, itemIndex) => itemIndex !== index))} />
          </div>
        ))}
      </RepeatableSection>

      <RepeatableSection title="Resources" onAdd={() => updateValue("resources", [...values.resources, emptyResource()])}>
        {values.resources.map((resource, index) => (
          <div key={index} className="grid gap-4 rounded-2xl border border-brand-border p-4 md:grid-cols-3">
            <input value={resource.label} onChange={(event) => updateResource(index, "label", event.target.value)} className={inputClassName} placeholder="Label" />
            <input value={resource.href} onChange={(event) => updateResource(index, "href", event.target.value)} className={inputClassName} placeholder="/path" />
            <input value={resource.description ?? ""} onChange={(event) => updateResource(index, "description", event.target.value)} className={inputClassName} placeholder="Description" />
            <RemoveButton onClick={() => updateValue("resources", values.resources.filter((_, itemIndex) => itemIndex !== index))} />
          </div>
        ))}
      </RepeatableSection>

      <RepeatableSection title="Calls to action" onAdd={() => updateValue("ctas", [...values.ctas, emptyCta()])}>
        {values.ctas.map((cta, index) => (
          <div key={index} className="grid gap-4 rounded-2xl border border-brand-border p-4 md:grid-cols-2">
            <input value={cta.label} onChange={(event) => updateCta(index, "label", event.target.value)} className={inputClassName} placeholder="Button label" />
            <input value={cta.href} onChange={(event) => updateCta(index, "href", event.target.value)} className={inputClassName} placeholder="/path" />
            <RemoveButton onClick={() => updateValue("ctas", values.ctas.filter((_, itemIndex) => itemIndex !== index))} />
          </div>
        ))}
      </RepeatableSection>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[30px] border border-brand-border bg-white p-5 shadow-sm">
        {mode === "edit" ? (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 rounded-full border border-rose-200 px-5 py-3 text-sm font-bold text-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            Delete
          </button>
        ) : (
          <span />
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save department
        </button>
      </div>
    </form>
  );
}

function RepeatableSection({
  title,
  children,
  onAdd,
}: {
  title: string;
  children: ReactNode;
  onAdd: () => void;
}) {
  return (
    <section className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm lg:p-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-heading text-xl font-semibold text-brand-ink">{title}</h3>
        <button type="button" onClick={onAdd} className="inline-flex items-center gap-2 rounded-full border border-brand-border px-4 py-2 text-sm font-semibold text-brand-ink">
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>
      <div className="grid gap-4">{children}</div>
    </section>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-rose-700">
      <Trash2 className="h-4 w-4" />
      Remove
    </button>
  );
}
