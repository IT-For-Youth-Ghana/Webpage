"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { AlertCircle, CheckCircle2, Loader2, Save, Trash2 } from "lucide-react";

import type { AdminApplicationRecord } from "@/types/admin";

const inputClassName =
  "mt-2 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20";
const textareaClassName =
  "mt-2 min-h-32 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm leading-7 text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20";

const statusOptions: Array<{ value: AdminApplicationRecord["status"]; label: string }> = [
  { value: "new", label: "New" },
  { value: "reviewed", label: "Reviewed" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "rejected", label: "Rejected" },
  { value: "enrolled", label: "Enrolled" },
];

type ApiResponse = {
  success?: boolean;
  message?: string;
  errors?: unknown;
};

type ApplicationFormProps = { application: AdminApplicationRecord };

export function ApplicationForm({ application }: ApplicationFormProps) {
  const router = useRouter();
  const [values, setValues] = useState({ status: application.status, notes: application.notes });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notice, setNotice] = useState<{ type: "idle" | "success" | "error"; message: string }>({ type: "idle", message: "" });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setNotice({ type: "idle", message: "" });
    try {
      const response = await fetch(`/api/admin/applications/${application.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const payload = (await response.json().catch(() => null)) as ApiResponse | null;
      if (!response.ok || !payload?.success) throw new Error(payload?.message || "Update failed");
      setNotice({ type: "success", message: payload.message || "Application updated." });
      router.push("/admin/applications");
      router.refresh();
    } catch (error) {
      setNotice({ type: "error", message: error instanceof Error ? error.message : "Update failed" });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this application?")) return;
    setIsDeleting(true);
    setNotice({ type: "idle", message: "" });
    try {
      const response = await fetch(`/api/admin/applications/${application.id}`, { method: "DELETE" });
      const payload = (await response.json().catch(() => null)) as ApiResponse | null;
      if (!response.ok || !payload?.success) throw new Error(payload?.message || "Delete failed");
      router.push("/admin/applications");
      router.refresh();
    } catch (error) {
      setNotice({ type: "error", message: error instanceof Error ? error.message : "Delete failed" });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {notice.type !== "idle" ? (
        <div className={`flex items-start gap-3 rounded-[24px] border p-5 text-sm font-medium ${notice.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
          {notice.type === "success" ? <CheckCircle2 className="mt-0.5 h-5 w-5" /> : <AlertCircle className="mt-0.5 h-5 w-5" />}
          <span>{notice.message}</span>
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-sm font-bold text-brand-ink">Status</label>
          <select
            value={values.status}
            onChange={(e) => setValues((v) => ({ ...v, status: e.target.value as AdminApplicationRecord["status"] }))}
            className={inputClassName}
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-bold text-brand-ink">Applicant</label>
          <input disabled value={application.name} className={inputClassName} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-sm font-bold text-brand-ink">Email</label>
          <input disabled value={application.email} className={inputClassName} />
        </div>
        <div>
          <label className="text-sm font-bold text-brand-ink">Course</label>
          <input disabled value={application.course} className={inputClassName} />
        </div>
      </div>

      <div>
        <label className="text-sm font-bold text-brand-ink">Notes</label>
        <textarea
          value={values.notes}
          onChange={(e) => setValues((v) => ({ ...v, notes: e.target.value }))}
          className={textareaClassName}
          placeholder="Internal notes for reviewers"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-full bg-brand-accent px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60">
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save changes
        </button>
        <button type="button" onClick={handleDelete} disabled={isDeleting} className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-white px-5 py-3 text-sm font-semibold text-brand-deep transition hover:border-rose-400 hover:text-rose-700 disabled:opacity-60">
          {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          Delete
        </button>
      </div>
    </form>
  );
}
