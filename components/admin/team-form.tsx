"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Save,
  Trash2,
} from "lucide-react";

import type { DepartmentProfile, TeamMemberProfile, TeamMemberStatus } from "@/types/content";

type TeamFormMode = "create" | "edit";

type TeamFormValues = {
  name: string;
  role: string;
  department: string;
  departmentId: string;
  departmentSlug: string;
  bio: string;
  photo: string;
  email: string;
  linkedin: string;
  featured: boolean;
  status: TeamMemberStatus;
  order: string;
};

type ApiResponse = {
  success?: boolean;
  message?: string;
  errors?: {
    fieldErrors?: Partial<Record<keyof TeamFormValues, string[]>>;
  };
};

type SubmitState = {
  type: "idle" | "success" | "error";
  message: string;
};

type TeamFormProps = {
  mode: TeamFormMode;
  member?: TeamMemberProfile;
  departments?: DepartmentProfile[];
};

const inputClassName =
  "mt-2 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20";

const textareaClassName =
  "mt-2 min-h-32 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm leading-7 text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20";

function getInitialValues(member?: TeamMemberProfile): TeamFormValues {
  return {
    name: member?.name ?? "",
    role: member?.role ?? "",
    department: member?.department ?? "",
    departmentId: member?.departmentId ?? "",
    departmentSlug: member?.departmentSlug ?? "",
    bio: member?.bio ?? "",
    photo: member?.photo ?? "",
    email: member?.email ?? "",
    linkedin: member?.linkedin ?? "",
    featured: member?.featured ?? false,
    status: member?.status ?? "active",
    order: typeof member?.order === "number" ? String(member.order) : "0",
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

export function TeamForm({ mode, member, departments = [] }: TeamFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<TeamFormValues>(() => getInitialValues(member));
  const [fieldErrors, setFieldErrors] = useState<ApiResponse["errors"]>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>({ type: "idle", message: "" });

  const getFieldError = (field: keyof TeamFormValues) => fieldErrors?.fieldErrors?.[field]?.[0];

  const updateValue = <Field extends keyof TeamFormValues>(
    field: Field,
    value: TeamFormValues[Field],
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

  const handleDepartmentSelect = (departmentId: string) => {
    const department = departments.find((item) => item.id === departmentId);

    updateValue("departmentId", departmentId);
    updateValue("departmentSlug", department?.slug ?? "");
    if (department) {
      updateValue("department", department.title.replace(/ department$/i, ""));
    }
  };

  const payload = useMemo(
    () => ({
      ...values,
      order: values.order,
    }),
    [values],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitState({ type: "idle", message: "" });
    setFieldErrors({});

    const endpoint = mode === "edit" && member ? `/api/admin/team/${member.id}` : "/api/admin/team";

    try {
      const response = await fetch(endpoint, {
        method: mode === "edit" ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json().catch(() => null)) as ApiResponse | null;

      if (!response.ok || !result?.success) {
        setFieldErrors(result?.errors ?? {});
        throw new Error(result?.message || "We could not save this team profile right now.");
      }

      setSubmitState({ type: "success", message: result.message || "Team member saved." });
      router.push("/admin/team");
      router.refresh();
    } catch (error) {
      setSubmitState({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "We could not save this team profile right now.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!member) {
      return;
    }

    const confirmed = window.confirm(
      "Delete this team profile now? This cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setSubmitState({ type: "idle", message: "" });

    try {
      const response = await fetch(`/api/admin/team/${member.id}`, { method: "DELETE" });
      const result = (await response.json().catch(() => null)) as ApiResponse | null;

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || "We could not delete this team profile right now.");
      }

      router.push("/admin/team");
      router.refresh();
    } catch (error) {
      setSubmitState({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "We could not delete this team profile right now.",
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
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-accent">Profile</p>
            <h2 className="mt-2 font-heading text-2xl font-bold text-brand-ink">Team member details</h2>
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
                placeholder="Full name"
              />
              <FieldError message={getFieldError("name")} />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="role" className="text-sm font-bold text-brand-ink">Role</label>
                <input
                  id="role"
                  required
                  value={values.role}
                  onChange={(event) => updateValue("role", event.target.value)}
                  aria-invalid={Boolean(getFieldError("role"))}
                  className={inputClassName}
                  placeholder="Programme Manager"
                />
                <FieldError message={getFieldError("role")} />
              </div>

              <div>
                <label htmlFor="departmentId" className="text-sm font-bold text-brand-ink">CMS department</label>
                <select
                  id="departmentId"
                  value={values.departmentId}
                  onChange={(event) => handleDepartmentSelect(event.target.value)}
                  className={inputClassName}
                >
                  <option value="">Select a department</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.title}
                    </option>
                  ))}
                </select>
                <FieldError message={getFieldError("departmentId")} />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="department" className="text-sm font-bold text-brand-ink">Display department</label>
                <input
                  id="department"
                  required
                  value={values.department}
                  onChange={(event) => updateValue("department", event.target.value)}
                  aria-invalid={Boolean(getFieldError("department"))}
                  className={inputClassName}
                  placeholder="Programmes"
                />
                <FieldError message={getFieldError("department")} />
              </div>

              <div>
                <label htmlFor="departmentSlug" className="text-sm font-bold text-brand-ink">Department slug</label>
                <input
                  id="departmentSlug"
                  value={values.departmentSlug}
                  onChange={(event) => updateValue("departmentSlug", event.target.value)}
                  aria-invalid={Boolean(getFieldError("departmentSlug"))}
                  className={inputClassName}
                  placeholder="programmes"
                />
                <FieldError message={getFieldError("departmentSlug")} />
              </div>
            </div>

            <div>
              <label htmlFor="bio" className="text-sm font-bold text-brand-ink">Bio</label>
              <textarea
                id="bio"
                required
                value={values.bio}
                onChange={(event) => updateValue("bio", event.target.value)}
                aria-invalid={Boolean(getFieldError("bio"))}
                className={textareaClassName}
                placeholder="Short professional profile and contribution to ITFY."
              />
              <FieldError message={getFieldError("bio")} />
            </div>
          </div>
        </section>

        <section className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm lg:p-8">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-accent">Publishing</p>
            <h2 className="mt-2 font-heading text-2xl font-bold text-brand-ink">Visibility and links</h2>
          </div>

          <div className="grid gap-5">
            <div>
              <label htmlFor="status" className="text-sm font-bold text-brand-ink">Status</label>
              <select
                id="status"
                value={values.status}
                onChange={(event) => updateValue("status", event.target.value as TeamMemberStatus)}
                className={inputClassName}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label htmlFor="order" className="text-sm font-bold text-brand-ink">Order</label>
              <input
                id="order"
                type="number"
                min={0}
                value={values.order}
                onChange={(event) => updateValue("order", event.target.value)}
                aria-invalid={Boolean(getFieldError("order"))}
                className={inputClassName}
                placeholder="0"
              />
              <FieldError message={getFieldError("order")} />
            </div>

            <label className="inline-flex items-center gap-3 rounded-2xl border border-brand-border bg-brand-mist px-4 py-3 text-sm font-medium text-brand-ink">
              <input
                type="checkbox"
                checked={values.featured}
                onChange={(event) => updateValue("featured", event.target.checked)}
                className="h-4 w-4 rounded border-slate-300"
              />
              Featured profile
            </label>

            <div>
              <label htmlFor="photo" className="text-sm font-bold text-brand-ink">Photo URL</label>
              <input
                id="photo"
                value={values.photo}
                onChange={(event) => updateValue("photo", event.target.value)}
                aria-invalid={Boolean(getFieldError("photo"))}
                className={inputClassName}
                placeholder="/images/people/member.jpg"
              />
              <FieldError message={getFieldError("photo")} />
            </div>

            <div>
              <label htmlFor="email" className="text-sm font-bold text-brand-ink">Email (optional)</label>
              <input
                id="email"
                value={values.email}
                onChange={(event) => updateValue("email", event.target.value)}
                aria-invalid={Boolean(getFieldError("email"))}
                className={inputClassName}
                placeholder="name@itforyouthghana.org"
              />
              <FieldError message={getFieldError("email")} />
            </div>

            <div>
              <label htmlFor="linkedin" className="text-sm font-bold text-brand-ink">LinkedIn URL (optional)</label>
              <input
                id="linkedin"
                value={values.linkedin}
                onChange={(event) => updateValue("linkedin", event.target.value)}
                aria-invalid={Boolean(getFieldError("linkedin"))}
                className={inputClassName}
                placeholder="https://www.linkedin.com/in/..."
              />
              <FieldError message={getFieldError("linkedin")} />
            </div>
          </div>
        </section>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-[26px] border border-brand-border bg-white px-5 py-4 shadow-sm">
        <button
          type="button"
          onClick={() => router.push("/admin/team")}
          className="inline-flex items-center gap-2 rounded-full border border-brand-border px-4 py-2 text-sm font-semibold text-brand-ink transition hover:bg-brand-mist"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to team
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {mode === "edit" ? "Update profile" : "Create profile"}
        </button>

        {mode === "edit" && member ? (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Delete profile
          </button>
        ) : null}
      </div>
    </form>
  );
}
