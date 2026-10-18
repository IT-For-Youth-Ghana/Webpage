"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Save, Trash2 } from "lucide-react";

import type { UserAccessRole } from "@/types/admin";

type UserFormMode = "create" | "edit";

export type AdminUser = {
  id?: string;
  name: string;
  email: string;
  role: UserAccessRole;
  status: "active" | "inactive";
  notes?: string;
};

type ApiResponse = {
  success?: boolean;
  message?: string;
  errors?: {
    fieldErrors?: Partial<Record<keyof AdminUser | "password", string[]>>;
  };
};

type SubmitState = { type: "idle" | "success" | "error"; message: string };

type UserFormProps = { mode: UserFormMode; user?: AdminUser };

const inputClassName =
  "mt-2 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20";
const textareaClassName =
  "mt-2 min-h-32 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm leading-7 text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20";

const roleOptions: Array<{ value: UserAccessRole; label: string }> = [
  { value: "super-admin", label: "Super admin" },
  { value: "editor", label: "Editor" },
  { value: "viewer", label: "Viewer" },
  { value: "file-server-only", label: "File server only" },
];

const statusOptions: Array<{ value: "active" | "inactive"; label: string }> = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-2 flex items-center gap-2 text-sm font-medium text-rose-600">
      <AlertCircle className="h-4 w-4" /> {message}
    </p>
  );
}

export function UserForm({ mode, user }: UserFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<AdminUser>(() => ({
    id: user?.id,
    name: user?.name ?? "",
    email: user?.email ?? "",
    role: user?.role ?? "viewer",
    status: user?.status ?? "active",
    notes: user?.notes ?? "",
  }));
  const [fieldErrors, setFieldErrors] = useState<ApiResponse["errors"]>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>({ type: "idle", message: "" });

  const getFieldError = (field: keyof AdminUser) => fieldErrors?.fieldErrors?.[field]?.[0];

  function update<Field extends keyof AdminUser>(field: Field, value: AdminUser[Field]) {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({
      ...current,
      fieldErrors: { ...(current?.fieldErrors ?? {}), [field]: undefined },
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitState({ type: "idle", message: "" });
    setFieldErrors({});

    const endpoint = mode === "edit" && user ? `/api/admin/users/${user.id}` : "/api/admin/users";
    const method = mode === "edit" ? "PUT" : "POST";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          role: values.role,
          status: values.status,
          notes: values.notes,
        }),
      });
      const payload = (await response.json().catch(() => null)) as ApiResponse | null;
      if (!response.ok || !payload?.success) {
        setFieldErrors(payload?.errors ?? {});
        throw new Error(payload?.message || "We could not save this user right now.");
      }
      setSubmitState({ type: "success", message: payload.message || "User saved." });
      router.push("/admin/users");
      router.refresh();
    } catch (error) {
      setSubmitState({
        type: "error",
        message: error instanceof Error ? error.message : "We could not save this user right now.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!user) return;
    if (!window.confirm("This will permanently remove this user record. Continue?")) return;
    setIsDeleting(true);
    setSubmitState({ type: "idle", message: "" });
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
      const payload = (await response.json().catch(() => null)) as ApiResponse | null;
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || "We could not delete this user right now.");
      }
      router.push("/admin/users");
      router.refresh();
    } catch (error) {
      setSubmitState({
        type: "error",
        message: error instanceof Error ? error.message : "We could not delete this user right now.",
      });
    } finally {
      setIsDeleting(false);
    }
  }

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

      <section className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm lg:p-8">
        <div className="grid gap-5">
          <div>
            <label htmlFor="name" className="text-sm font-bold text-brand-ink">Name</label>
            <input
              id="name"
              required
              value={values.name}
              onChange={(e) => update("name", e.target.value)}
              aria-invalid={Boolean(getFieldError("name"))}
              className={inputClassName}
              placeholder="Full name"
            />
            <FieldError message={getFieldError("name")} />
          </div>

          <div>
            <label htmlFor="email" className="text-sm font-bold text-brand-ink">Email</label>
            <input
              id="email"
              required
              type="email"
              value={values.email}
              onChange={(e) => update("email", e.target.value)}
              aria-invalid={Boolean(getFieldError("email"))}
              className={inputClassName}
              placeholder="name@example.com"
            />
            <FieldError message={getFieldError("email")} />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="role" className="text-sm font-bold text-brand-ink">Role</label>
              <select
                id="role"
                value={values.role}
                onChange={(e) => update("role", e.target.value as AdminUser["role"])}
                className={inputClassName}
              >
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <FieldError message={getFieldError("role")} />
            </div>
            <div>
              <label htmlFor="status" className="text-sm font-bold text-brand-ink">Status</label>
              <select
                id="status"
                value={values.status}
                onChange={(e) => update("status", e.target.value as AdminUser["status"])}
                className={inputClassName}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <FieldError message={getFieldError("status")} />
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="text-sm font-bold text-brand-ink">Notes</label>
            <textarea
              id="notes"
              value={values.notes}
              onChange={(e) => update("notes", e.target.value)}
              className={textareaClassName}
              placeholder="Internal notes"
            />
            <FieldError message={getFieldError("notes")} />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-full bg-brand-accent px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {mode === "edit" ? "Save changes" : "Create user"}
          </button>

          {mode === "edit" && user ? (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-white px-5 py-3 text-sm font-semibold text-brand-deep transition hover:border-rose-400 hover:text-rose-700 disabled:opacity-60"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Delete user
            </button>
          ) : null}
        </div>
      </section>
    </form>
  );
}
