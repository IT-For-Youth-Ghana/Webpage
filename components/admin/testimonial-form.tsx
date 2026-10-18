"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Save,
  Trash2,
} from "lucide-react";

import type { Testimonial } from "@/components/home/testimonials-section";

type TestimonialFormMode = "create" | "edit";

type TestimonialFormValues = {
  name: string;
  quote: string;
  role: string;
  programme: string;
  year: string;
  avatar: string;
  initials: string;
  active: boolean;
};

type ApiResponse = {
  success?: boolean;
  message?: string;
  errors?: {
    fieldErrors?: Partial<Record<keyof TestimonialFormValues, string[]>>;
  };
};

type SubmitState = {
  type: "idle" | "success" | "error";
  message: string;
};

type TestimonialFormProps = {
  mode: TestimonialFormMode;
  testimonial?: Testimonial;
};

const inputClassName =
  "mt-2 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20";

const textareaClassName =
  "mt-2 min-h-32 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm leading-7 text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20";

function getInitialValues(testimonial?: Testimonial): TestimonialFormValues {
  return {
    name: testimonial?.name ?? "",
    quote: testimonial?.quote ?? "",
    role: testimonial?.role ?? "",
    programme: testimonial?.programme ?? "",
    year: testimonial?.year ?? "",
    avatar: testimonial?.avatar ?? "",
    initials: testimonial?.initials ?? "",
    active: testimonial?.active !== false,
  };
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p className="mt-2 flex items-center gap-2 text-sm font-medium text-rose-600">
      <AlertCircle className="h-4 w-4" />
      {message}
    </p>
  );
}

export function TestimonialForm({ mode, testimonial }: TestimonialFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<TestimonialFormValues>(() => getInitialValues(testimonial));
  const [fieldErrors, setFieldErrors] = useState<ApiResponse["errors"]>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>({
    type: "idle",
    message: "",
  });

  const getFieldError = (field: keyof TestimonialFormValues) =>
    fieldErrors?.fieldErrors?.[field]?.[0];

  const updateValue = <Field extends keyof TestimonialFormValues>(
    field: Field,
    value: TestimonialFormValues[Field],
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({
      ...current,
      fieldErrors: {
        ...current?.fieldErrors,
        [field]: undefined,
      },
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitState({ type: "idle", message: "" });
    setFieldErrors({});

    const endpoint = mode === "edit" && testimonial
      ? `/api/admin/testimonials/${testimonial.id}`
      : "/api/admin/testimonials";

    try {
      const response = await fetch(endpoint, {
        method: mode === "edit" ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const payload = (await response.json().catch(() => null)) as ApiResponse | null;

      if (!response.ok || !payload?.success) {
        setFieldErrors(payload?.errors ?? {});
        throw new Error(payload?.message || "We could not save this testimonial right now.");
      }

      setSubmitState({
        type: "success",
        message: payload.message || "Testimonial saved.",
      });
      router.push("/admin/testimonials");
      router.refresh();
    } catch (error) {
      setSubmitState({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "We could not save this testimonial right now.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!testimonial) {
      return;
    }

    const confirmed = window.confirm(
      "Delete this testimonial now? This cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setSubmitState({ type: "idle", message: "" });

    try {
      const response = await fetch(`/api/admin/testimonials/${testimonial.id}`, {
        method: "DELETE",
      });
      const payload = (await response.json().catch(() => null)) as ApiResponse | null;

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || "We could not delete this testimonial right now.");
      }

      router.push("/admin/testimonials");
      router.refresh();
    } catch (error) {
      setSubmitState({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "We could not delete this testimonial right now.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

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
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-accent">Story</p>
            <h2 className="mt-2 font-heading text-2xl font-bold text-brand-ink">Testimonial details</h2>
          </div>

          <div className="grid gap-5">
            <div>
              <label htmlFor="name" className="text-sm font-bold text-brand-ink">Name</label>
              <input
                id="name"
                required
                value={values.name}
                onChange={(event) => updateValue("name", event.target.value)}
                aria-invalid={Boolean(getFieldError("name"))}
                className={inputClassName}
                placeholder="Name"
              />
              <FieldError message={getFieldError("name")} />
            </div>

            <div>
              <label htmlFor="role" className="text-sm font-bold text-brand-ink">Role</label>
              <input
                id="role"
                required
                value={values.role}
                onChange={(event) => updateValue("role", event.target.value)}
                aria-invalid={Boolean(getFieldError("role"))}
                className={inputClassName}
                placeholder="Role or title"
              />
              <FieldError message={getFieldError("role")} />
            </div>

            <div>
              <label htmlFor="quote" className="text-sm font-bold text-brand-ink">Quote</label>
              <textarea
                id="quote"
                required
                value={values.quote}
                onChange={(event) => updateValue("quote", event.target.value)}
                aria-invalid={Boolean(getFieldError("quote"))}
                className={textareaClassName}
                placeholder="Quote used across homepage and impact pages"
              />
              <FieldError message={getFieldError("quote")} />
            </div>
          </div>
        </section>

        <section className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm lg:p-8">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-accent">Metadata</p>
            <h2 className="mt-2 font-heading text-2xl font-bold text-brand-ink">Display controls</h2>
          </div>

          <div className="grid gap-5">
            <div>
              <label htmlFor="programme" className="text-sm font-bold text-brand-ink">Programme</label>
              <input
                id="programme"
                value={values.programme}
                onChange={(event) => updateValue("programme", event.target.value)}
                aria-invalid={Boolean(getFieldError("programme"))}
                className={inputClassName}
                placeholder="Optional programme name"
              />
              <FieldError message={getFieldError("programme")} />
            </div>

            <div>
              <label htmlFor="year" className="text-sm font-bold text-brand-ink">Year / cohort</label>
              <input
                id="year"
                value={values.year}
                onChange={(event) => updateValue("year", event.target.value)}
                aria-invalid={Boolean(getFieldError("year"))}
                className={inputClassName}
                placeholder="2026"
              />
              <FieldError message={getFieldError("year")} />
            </div>

            <div>
              <label htmlFor="avatar" className="text-sm font-bold text-brand-ink">Avatar URL</label>
              <input
                id="avatar"
                value={values.avatar}
                onChange={(event) => updateValue("avatar", event.target.value)}
                aria-invalid={Boolean(getFieldError("avatar"))}
                className={inputClassName}
                placeholder="/images/people/person.jpg"
              />
              <FieldError message={getFieldError("avatar")} />
            </div>

            <div>
              <label htmlFor="initials" className="text-sm font-bold text-brand-ink">Initials (optional)</label>
              <input
                id="initials"
                value={values.initials}
                onChange={(event) => updateValue("initials", event.target.value.toUpperCase().slice(0, 3))}
                aria-invalid={Boolean(getFieldError("initials"))}
                className={inputClassName}
                placeholder="IT"
              />
              <FieldError message={getFieldError("initials")} />
            </div>

            <label className="inline-flex items-center gap-3 rounded-2xl border border-brand-border bg-brand-mist px-4 py-3 text-sm font-medium text-brand-ink">
              <input
                type="checkbox"
                checked={values.active}
                onChange={(event) => updateValue("active", event.target.checked)}
                className="h-4 w-4 rounded border-slate-300"
              />
              Show on public pages
            </label>
          </div>
        </section>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-[26px] border border-brand-border bg-white px-5 py-4 shadow-sm">
        <button
          type="button"
          onClick={() => router.push("/admin/testimonials")}
          className="inline-flex items-center gap-2 rounded-full border border-brand-border px-4 py-2 text-sm font-semibold text-brand-ink transition hover:bg-brand-mist"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to testimonials
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {mode === "edit" ? "Update testimonial" : "Create testimonial"}
        </button>

        {mode === "edit" && testimonial ? (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            Delete testimonial
          </button>
        ) : null}
      </div>
    </form>
  );
}
