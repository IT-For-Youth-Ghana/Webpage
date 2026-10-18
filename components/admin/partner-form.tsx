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

import type { Partner } from "@/components/home/patrners-strip";

type PartnerFormMode = "create" | "edit";

type PartnerFormValues = {
  name: string;
  logo: string;
  href: string;
  active: boolean;
  order?: number;
};

type ApiResponse = {
  success?: boolean;
  message?: string;
  errors?: {
    fieldErrors?: Partial<Record<keyof PartnerFormValues, string[]>>;
  };
};

type SubmitState = {
  type: "idle" | "success" | "error";
  message: string;
};

type PartnerFormProps = {
  mode: PartnerFormMode;
  partner?: Partner;
};

const inputClassName =
  "mt-2 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20";

function getInitialValues(partner?: Partner): PartnerFormValues {
  return {
    name: partner?.name ?? "",
    logo: partner?.logo ?? "",
    href: partner?.href ?? "",
    active: partner?.active !== false,
    order: partner?.order ?? 0,
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

export function PartnerForm({ mode, partner }: PartnerFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<PartnerFormValues>(() => getInitialValues(partner));
  const [fieldErrors, setFieldErrors] = useState<ApiResponse["errors"]>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>({
    type: "idle",
    message: "",
  });

  const getFieldError = (field: keyof PartnerFormValues) =>
    fieldErrors?.fieldErrors?.[field]?.[0];

  const updateValue = <Field extends keyof PartnerFormValues>(
    field: Field,
    value: PartnerFormValues[Field],
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

    const endpoint = mode === "edit" && partner ? `/api/admin/partners/${partner.id}` : "/api/admin/partners";

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
        throw new Error(payload?.message || "We could not save this partner right now.");
      }

      setSubmitState({
        type: "success",
        message: payload.message || "Partner saved.",
      });
      router.push("/admin/partners");
      router.refresh();
    } catch (error) {
      setSubmitState({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "We could not save this partner right now.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!partner) {
      return;
    }

    const confirmed = window.confirm("Delete this partner now? This cannot be undone.");

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setSubmitState({ type: "idle", message: "" });

    try {
      const response = await fetch(`/api/admin/partners/${partner.id}`, {
        method: "DELETE",
      });
      const payload = (await response.json().catch(() => null)) as ApiResponse | null;

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || "We could not delete this partner right now.");
      }

      router.push("/admin/partners");
      router.refresh();
    } catch (error) {
      setSubmitState({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "We could not delete this partner right now.",
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
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-accent">Partner profile</p>
            <h2 className="mt-2 font-heading text-2xl font-bold text-brand-ink">Core details</h2>
          </div>

          <div className="grid gap-5">
            <div>
              <label htmlFor="name" className="text-sm font-bold text-brand-ink">
                Partner name
              </label>
              <input
                id="name"
                required
                value={values.name}
                onChange={(event) => updateValue("name", event.target.value)}
                aria-invalid={Boolean(getFieldError("name"))}
                className={inputClassName}
                placeholder="Partner organisation"
              />
              <FieldError message={getFieldError("name")} />
            </div>

            <div>
              <label htmlFor="logo" className="text-sm font-bold text-brand-ink">
                Logo URL
              </label>
              <input
                id="logo"
                value={values.logo}
                onChange={(event) => updateValue("logo", event.target.value)}
                aria-invalid={Boolean(getFieldError("logo"))}
                className={inputClassName}
                placeholder="/images/partners/logo.png"
              />
              <FieldError message={getFieldError("logo")} />
            </div>

            <div>
              <label htmlFor="href" className="text-sm font-bold text-brand-ink">
                Website URL
              </label>
              <input
                id="href"
                value={values.href}
                onChange={(event) => updateValue("href", event.target.value)}
                aria-invalid={Boolean(getFieldError("href"))}
                className={inputClassName}
                placeholder="https://partner.org"
              />
              <FieldError message={getFieldError("href")} />
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

              <div>
                <label htmlFor="order" className="text-sm font-bold text-brand-ink">
                  Display order (lower shows first)
                </label>
                <input
                  id="order"
                  type="number"
                  value={values.order ?? 0}
                  onChange={(e) => updateValue("order", Number(e.target.value))}
                  className="mt-2 w-32 rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20"
                />
              </div>
          </div>
        </section>

        <section className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm lg:p-8">
          <h3 className="font-heading text-xl font-semibold text-brand-ink">Preview</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            This profile is used by homepage partner strip and partner pages. Keep names concise and logos transparent where possible.
          </p>
        </section>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-[26px] border border-brand-border bg-white px-5 py-4 shadow-sm">
        <button
          type="button"
          onClick={() => router.push("/admin/partners")}
          className="inline-flex items-center gap-2 rounded-full border border-brand-border px-4 py-2 text-sm font-semibold text-brand-ink transition hover:bg-brand-mist"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to partners
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {mode === "edit" ? "Update partner" : "Create partner"}
        </button>

        {mode === "edit" && partner ? (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            Delete partner
          </button>
        ) : null}
      </div>
    </form>
  );
}
