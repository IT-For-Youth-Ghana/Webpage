"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  LockKeyhole,
} from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";

import { getFirebaseClientAuth } from "@/lib/firebase/client";

type AdminLoginFormProps = {
  nextPath: string;
};

type SubmitState = {
  type: "idle" | "success" | "error";
  message: string;
};

type SessionResponse = {
  success?: boolean;
  message?: string;
};

export function AdminLoginForm({ nextPath }: AdminLoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>({
    type: "idle",
    message: "",
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitState({ type: "idle", message: "" });

    try {
      const auth = getFirebaseClientAuth();
      const credential = await signInWithEmailAndPassword(auth, email, password);

      if (!credential.user) {
        throw new Error("The CMS session could not be created.");
      }

      const idToken = await credential.user.getIdToken(true);
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });
      const payload = (await response.json().catch(() => null)) as SessionResponse | null;

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || "The CMS session could not be created.");
      }

      setSubmitState({
        type: "success",
        message: payload.message || "Signed in.",
      });
      router.replace(nextPath);
      router.refresh();
    } catch (error) {
      setSubmitState({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "The CMS session could not be created.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
      {submitState.type !== "idle" ? (
        <div
          className={`flex items-start gap-3 rounded-2xl border p-4 text-sm font-medium ${
            submitState.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          {submitState.type === "success" ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4" />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4" />
          )}
          <span>{submitState.message}</span>
        </div>
      ) : null}

      <div>
        <label htmlFor="email" className="text-sm font-bold text-brand-ink">
          Email address
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-brand-border px-4 py-3 text-sm text-brand-ink outline-none transition focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20"
          placeholder="admin@example.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="text-sm font-bold text-brand-ink">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-brand-border px-4 py-3 text-sm text-brand-ink outline-none transition focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20"
          placeholder="Your Firebase password"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-deep px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LockKeyhole className="h-4 w-4" />
        )}
        Sign in to CMS
      </button>
    </form>
  );
}
