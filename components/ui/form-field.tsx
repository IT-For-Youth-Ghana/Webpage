import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

const controlClassName =
  "mt-2 w-full rounded-2xl border border-brand-border bg-white px-4 py-3 text-sm text-brand-ink outline-none transition placeholder:text-slate-400 focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-70";

type FormFieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
};

export function FormField({ label, htmlFor, error, required, children }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="text-sm font-bold text-brand-ink">
        {label}
        {required ? <span aria-hidden="true" className="ml-1 text-brand-accent">*</span> : null}
      </label>
      {children}
      {error ? <p className="mt-2 text-base font-medium text-rose-600">{error}</p> : null}
    </div>
  );
}

export function TextInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(controlClassName, className)} {...props} />;
}

export function TextArea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(controlClassName, className)} {...props} />;
}
