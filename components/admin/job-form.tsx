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

import type { JobListing, JobStatus, JobType } from "@/types/content";

type JobFormMode = "create" | "edit";

type JobFormValues = {
  title: string;
  summary: string;
  team: string;
  location: string;
  type: JobType;
  status: JobStatus;
  applyUrl: string;
  closingDate: string;
  featured: boolean;
};

type ApiResponse = {
  success?: boolean;
  message?: string;
  errors?: {
    fieldErrors?: Partial<Record<keyof JobFormValues, string[]>>;
  };
};

type SubmitState = {
  type: "idle" | "success" | "error";
  message: string;
};

type JobFormProps = {
  mode: JobFormMode;
  job?: JobListing;
};

const inputClassName =
  "mt-2 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20";

const textareaClassName =
  "mt-2 min-h-32 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm leading-7 text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20";

function getInitialValues(job?: JobListing): JobFormValues {
  return {
    title: job?.title ?? "",
    summary: job?.summary ?? "",
    team: job?.team ?? "",
    location: job?.location ?? "Accra, Ghana",
    type: job?.type ?? "full-time",
    status: job?.status ?? "draft",
    applyUrl: job?.applyUrl ?? "",
    closingDate: job?.closingDate ?? "",
    featured: job?.featured ?? false,
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

export function JobForm({ mode, job }: JobFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<JobFormValues>(() => getInitialValues(job));
  const [fieldErrors, setFieldErrors] = useState<ApiResponse["errors"]>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>({
    type: "idle",
    message: "",
  });

  const getFieldError = (field: keyof JobFormValues) =>
    fieldErrors?.fieldErrors?.[field]?.[0];

  const updateValue = <Field extends keyof JobFormValues>(
    field: Field,
    value: JobFormValues[Field],
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

    const endpoint = mode === "edit" && job ? `/api/admin/jobs/${job.id}` : "/api/admin/jobs";

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
        throw new Error(payload?.message || "We could not save this job listing right now.");
      }

      setSubmitState({
        type: "success",
        message: payload.message || "Job listing saved.",
      });
      router.push("/admin/jobs");
      router.refresh();
    } catch (error) {
      setSubmitState({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "We could not save this job listing right now.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!job) {
      return;
    }

    const confirmed = window.confirm("Delete this job listing now? This cannot be undone.");

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setSubmitState({ type: "idle", message: "" });

    try {
      const response = await fetch(`/api/admin/jobs/${job.id}`, {
        method: "DELETE",
      });
      const payload = (await response.json().catch(() => null)) as ApiResponse | null;

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || "We could not delete this job listing right now.");
      }

      router.push("/admin/jobs");
      router.refresh();
    } catch (error) {
      setSubmitState({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "We could not delete this job listing right now.",
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
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-accent">Role profile</p>
            <h2 className="mt-2 font-heading text-2xl font-bold text-brand-ink">Job details</h2>
          </div>

          <div className="grid gap-5">
            <div>
              <label htmlFor="title" className="text-sm font-bold text-brand-ink">Title</label>
              <input
                id="title"
                required
                value={values.title}
                onChange={(event) => updateValue("title", event.target.value)}
                aria-invalid={Boolean(getFieldError("title"))}
                className={inputClassName}
                placeholder="Role title"
              />
              <FieldError message={getFieldError("title")} />
            </div>

            <div>
              <label htmlFor="summary" className="text-sm font-bold text-brand-ink">Summary</label>
              <textarea
                id="summary"
                required
                value={values.summary}
                onChange={(event) => updateValue("summary", event.target.value)}
                aria-invalid={Boolean(getFieldError("summary"))}
                className={textareaClassName}
                placeholder="Short role description"
              />
              <FieldError message={getFieldError("summary")} />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="team" className="text-sm font-bold text-brand-ink">Team</label>
                <input
                  id="team"
                  required
                  value={values.team}
                  onChange={(event) => updateValue("team", event.target.value)}
                  aria-invalid={Boolean(getFieldError("team"))}
                  className={inputClassName}
                  placeholder="Programmes"
                />
                <FieldError message={getFieldError("team")} />
              </div>

              <div>
                <label htmlFor="location" className="text-sm font-bold text-brand-ink">Location</label>
                <input
                  id="location"
                  required
                  value={values.location}
                  onChange={(event) => updateValue("location", event.target.value)}
                  aria-invalid={Boolean(getFieldError("location"))}
                  className={inputClassName}
                  placeholder="Accra, Ghana"
                />
                <FieldError message={getFieldError("location")} />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm lg:p-8">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-accent">Publication</p>
            <h2 className="mt-2 font-heading text-2xl font-bold text-brand-ink">Status and CTA</h2>
          </div>

          <div className="grid gap-5">
            <div>
              <label htmlFor="type" className="text-sm font-bold text-brand-ink">Type</label>
              <select
                id="type"
                value={values.type}
                onChange={(event) => updateValue("type", event.target.value as JobType)}
                className={inputClassName}
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="volunteer">Volunteer</option>
              </select>
            </div>

            <div>
              <label htmlFor="status" className="text-sm font-bold text-brand-ink">Status</label>
              <select
                id="status"
                value={values.status}
                onChange={(event) => updateValue("status", event.target.value as JobStatus)}
                className={inputClassName}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div>
              <label htmlFor="applyUrl" className="text-sm font-bold text-brand-ink">Apply URL</label>
              <input
                id="applyUrl"
                value={values.applyUrl}
                onChange={(event) => updateValue("applyUrl", event.target.value)}
                aria-invalid={Boolean(getFieldError("applyUrl"))}
                className={inputClassName}
                placeholder="https://..."
              />
              <FieldError message={getFieldError("applyUrl")} />
            </div>

            <div>
              <label htmlFor="closingDate" className="text-sm font-bold text-brand-ink">Closing date</label>
              <input
                id="closingDate"
                type="date"
                value={values.closingDate}
                onChange={(event) => updateValue("closingDate", event.target.value)}
                aria-invalid={Boolean(getFieldError("closingDate"))}
                className={inputClassName}
              />
              <FieldError message={getFieldError("closingDate")} />
            </div>

            <label className="inline-flex items-center gap-3 rounded-2xl border border-brand-border bg-brand-mist px-4 py-3 text-sm font-medium text-brand-ink">
              <input
                type="checkbox"
                checked={values.featured}
                onChange={(event) => updateValue("featured", event.target.checked)}
                className="h-4 w-4 rounded border-slate-300"
              />
              Featured role
            </label>
          </div>
        </section>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-[26px] border border-brand-border bg-white px-5 py-4 shadow-sm">
        <button
          type="button"
          onClick={() => router.push("/admin/jobs")}
          className="inline-flex items-center gap-2 rounded-full border border-brand-border px-4 py-2 text-sm font-semibold text-brand-ink transition hover:bg-brand-mist"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to jobs
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {mode === "edit" ? "Update role" : "Create role"}
        </button>

        {mode === "edit" && job ? (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            Delete role
          </button>
        ) : null}
      </div>
    </form>
  );
}
