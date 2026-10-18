"use client";

import { FormEvent, useState } from "react";
import clsx from "clsx";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Send,
} from "lucide-react";

import type {
  ContactEnquiryOption,
  ContactEnquiryType,
  PreferredContactMethod,
} from "@/types/content";
import { Button } from "@/components/ui/button";
import { TextArea, TextInput } from "@/components/ui/form-field";

type ContactFormValues = {
  name: string;
  email: string;
  phone: string;
  organisation: string;
  enquiryType: ContactEnquiryType;
  preferredContact: PreferredContactMethod;
  message: string;
  consent: boolean;
};

type ContactFormProps = {
  enquiryOptions: ContactEnquiryOption[];
  privacyNote: string;
};

type ApiResponse = {
  success?: boolean;
  message?: string;
  errors?: {
    fieldErrors?: Partial<Record<keyof ContactFormValues, string[]>>;
  };
};

type SubmitState = {
  type: "idle" | "success" | "error";
  message: string;
};

const initialValues: ContactFormValues = {
  name: "",
  email: "",
  phone: "",
  organisation: "",
  enquiryType: "training",
  preferredContact: "email",
  message: "",
  consent: false,
};

const preferredContactOptions: Array<{
  value: PreferredContactMethod;
  label: string;
}> = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "either", label: "Either" },
];

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p className="mt-2 flex items-center gap-2 text-base font-medium text-rose-600">
      <AlertCircle className="h-4 w-4" />
      {message}
    </p>
  );
}

export function ContactForm({
  enquiryOptions,
  privacyNote,
}: ContactFormProps) {
  const [values, setValues] = useState<ContactFormValues>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<ApiResponse["errors"]>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>({
    type: "idle",
    message: "",
  });

  const getFieldError = (field: keyof ContactFormValues) =>
    fieldErrors?.fieldErrors?.[field]?.[0];

  const updateValue = <Field extends keyof ContactFormValues>(
    field: Field,
    value: ContactFormValues[Field],
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

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const payload = (await response.json().catch(() => null)) as ApiResponse | null;

      if (!response.ok || !payload?.success) {
        setFieldErrors(payload?.errors ?? {});
        throw new Error(payload?.message || "We could not send your message right now.");
      }

      setValues(initialValues);
      setSubmitState({
        type: "success",
        message: payload.message || "Thanks for reaching out. Your message has been received.",
      });
    } catch (error) {
      setSubmitState({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "We could not send your message right now.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-bold text-brand-ink">
            Full name
          </label>
          <TextInput
            id="name"
            name="name"
            type="text"
            required
            value={values.name}
            onChange={(event) => updateValue("name", event.target.value)}
            aria-invalid={Boolean(getFieldError("name"))}
            placeholder="Your name"
          />
          <FieldError message={getFieldError("name")} />
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-bold text-brand-ink">
            Email address
          </label>
          <TextInput
            id="email"
            name="email"
            type="email"
            required
            value={values.email}
            onChange={(event) => updateValue("email", event.target.value)}
            aria-invalid={Boolean(getFieldError("email"))}
            placeholder="you@example.com"
          />
          <FieldError message={getFieldError("email")} />
        </div>

        <div>
          <label htmlFor="phone" className="text-sm font-bold text-brand-ink">
            Phone number
          </label>
          <TextInput
            id="phone"
            name="phone"
            type="tel"
            value={values.phone}
            onChange={(event) => updateValue("phone", event.target.value)}
            aria-invalid={Boolean(getFieldError("phone"))}
            placeholder="+233 ..."
          />
          <FieldError message={getFieldError("phone")} />
        </div>

        <div>
          <label htmlFor="organisation" className="text-sm font-bold text-brand-ink">
            Organisation
          </label>
          <TextInput
            id="organisation"
            name="organisation"
            type="text"
            value={values.organisation}
            onChange={(event) => updateValue("organisation", event.target.value)}
            aria-invalid={Boolean(getFieldError("organisation"))}
            placeholder="Optional"
          />
          <FieldError message={getFieldError("organisation")} />
        </div>
      </div>

      <fieldset>
        <legend className="text-sm font-bold text-brand-ink">
          What is this about?
        </legend>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {enquiryOptions.map((option) => {
            const isSelected = values.enquiryType === option.value;

            return (
              <label
                key={option.value}
                className={clsx(
                  "cursor-pointer rounded-2xl border p-4 transition",
                  isSelected
                    ? "border-brand-accent bg-brand-warm shadow-sm"
                    : "border-brand-border bg-white hover:border-brand-accent/60",
                )}
              >
                <input
                  type="radio"
                  name="enquiryType"
                  value={option.value}
                  checked={isSelected}
                  onChange={() => updateValue("enquiryType", option.value)}
                  className="sr-only"
                />
                <span className="block text-sm font-bold text-brand-ink">
                  {option.label}
                </span>
                <span className="mt-1 block text-sm leading-6 text-slate-600">
                  {option.description}
                </span>
              </label>
            );
          })}
        </div>
        <FieldError message={getFieldError("enquiryType")} />
      </fieldset>

      <fieldset>
        <legend className="text-sm font-bold text-brand-ink">
          Preferred reply method
        </legend>
        <div className="mt-3 flex flex-wrap gap-3">
          {preferredContactOptions.map((option) => {
            const isSelected = values.preferredContact === option.value;

            return (
              <label
                key={option.value}
                className={clsx(
                  "cursor-pointer rounded-full border px-4 py-2 text-sm font-bold transition",
                  isSelected
                    ? "border-brand-deep bg-brand-deep text-white"
                    : "border-brand-border bg-white text-slate-600 hover:border-brand-accent hover:text-brand-ink",
                )}
              >
                <input
                  type="radio"
                  name="preferredContact"
                  value={option.value}
                  checked={isSelected}
                  onChange={() => updateValue("preferredContact", option.value)}
                  className="sr-only"
                />
                {option.label}
              </label>
            );
          })}
        </div>
        <FieldError message={getFieldError("preferredContact")} />
      </fieldset>

      <div>
        <label htmlFor="message" className="text-sm font-bold text-brand-ink">
          Message
        </label>
        <TextArea
          id="message"
          name="message"
          required
          value={values.message}
          onChange={(event) => updateValue("message", event.target.value)}
          aria-invalid={Boolean(getFieldError("message"))}
          className="min-h-44"
          placeholder="Tell us what you need, who it concerns, and any timing details that matter."
        />
        <div className="mt-2 flex flex-wrap justify-between gap-2 text-xs text-slate-500">
          <FieldError message={getFieldError("message")} />
          <span>{values.message.trim().length} characters</span>
        </div>
      </div>

      <label className="flex cursor-pointer gap-3 rounded-2xl border border-brand-border bg-brand-mist/45 p-4">
        <input
          type="checkbox"
          name="consent"
          checked={values.consent}
          onChange={(event) => updateValue("consent", event.target.checked)}
          className="mt-1 h-4 w-4 rounded border-brand-border text-brand-deep focus:ring-brand-accent"
        />
        <span>
          <span className="block text-sm font-bold text-brand-ink">
            You can contact me about this enquiry.
          </span>
          <span className="mt-1 block text-sm leading-6 text-slate-600">
            {privacyNote}
          </span>
          <FieldError message={getFieldError("consent")} />
        </span>
      </label>

      <Button
        type="submit"
        disabled={isSubmitting}
        variant="dark"
        size="lg"
        className="w-full sm:w-auto"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send message
          </>
        )}
      </Button>

      <p
        aria-live="polite"
        className={clsx(
          "flex items-start gap-2 rounded-2xl px-4 py-3 text-base font-medium",
          submitState.type === "idle" && "hidden",
          submitState.type === "success" && "bg-emerald-50 text-emerald-700",
          submitState.type === "error" && "bg-rose-50 text-rose-700",
        )}
      >
        {submitState.type === "success" ? (
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
        ) : (
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        )}
        {submitState.message}
      </p>
    </form>
  );
}
