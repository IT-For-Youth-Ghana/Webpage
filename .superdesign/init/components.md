# Shared UI components

Framework: React 18 with Next.js 14 App Router. Styling: Tailwind CSS 3 with custom primitives.

### `components/ui/button.tsx`

```tsx
import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "pink"
  | "blue"
  | "solid-pink"
  | "solid-blue"
  | "pink-outline"
  | "blue-outline"
  | "white"
  | "white-outline"
  | "dark"
  | "danger";
export type ButtonSize = "sm" | "md" | "lg";

type SharedButtonProps = {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

type ButtonProps = SharedButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type ButtonLinkProps = SharedButtonProps & {
  href: string;
  external?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "border-brand-accent bg-brand-accent text-white hover:border-brand-accent hover:bg-white hover:text-brand-accent",
  secondary: "border-brand-primary bg-brand-primary text-white hover:border-brand-primary hover:bg-white hover:text-brand-primary",
  outline: "border-brand-primary bg-white text-brand-primary hover:bg-brand-primary hover:text-white",
  ghost: "border-white/70 bg-transparent text-white hover:border-white hover:bg-white/10",
  pink: "border-brand-accent bg-brand-accent text-white hover:border-brand-accent hover:bg-white hover:text-brand-accent",
  blue: "border-brand-primary bg-brand-primary text-white hover:border-brand-primary hover:bg-white hover:text-brand-primary",
  "solid-pink": "border-brand-accent bg-brand-accent text-white hover:border-brand-accent hover:bg-brand-accent hover:text-white",
  "solid-blue": "border-brand-primary bg-brand-primary text-white hover:border-brand-primary hover:bg-brand-primary hover:text-white",
  "pink-outline": "border-brand-accent bg-white text-brand-accent hover:bg-brand-accent hover:text-white",
  "blue-outline": "border-brand-primary bg-white text-brand-primary hover:bg-brand-primary hover:text-white",
  white: "border-white bg-white text-brand-deep hover:bg-transparent hover:text-white",
  "white-outline": "border-white/80 bg-transparent text-white hover:border-white hover:bg-white hover:text-brand-deep",
  dark: "border-brand-deep bg-brand-deep text-white hover:border-brand-deep hover:bg-white hover:text-brand-deep",
  danger: "border-rose-600 bg-rose-600 text-white hover:border-rose-600 hover:bg-white hover:text-rose-700",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3.5 py-2 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-sm",
};

export function buttonClassName({
  variant = "primary",
  size = "md",
  className,
}: Pick<SharedButtonProps, "variant" | "size" | "className"> = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-control border font-bold transition duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );
}

/** A consistent action primitive for links and native buttons. */
export function Button(props: ButtonProps | ButtonLinkProps) {
  const { children, className, variant, size } = props;
  const classes = buttonClassName({ className, variant, size });

  if ("href" in props && props.href) {
    const { href, external } = props;

    if (external) {
      return (
        <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  const buttonProps = { ...(props as ButtonProps) };
  const type = buttonProps.type ?? "button";
  delete buttonProps.children;
  delete buttonProps.className;
  delete buttonProps.variant;
  delete buttonProps.size;
  delete buttonProps.href;
  delete buttonProps.type;
  return (
    <button type={type} className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
```

### `components/ui/card.tsx`

```tsx
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  padding?: "none" | "sm" | "md" | "lg";
  tone?: "default" | "muted" | "dark";
  variant?: "surface" | "feature" | "story" | "resource" | "stat";
};

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

const toneClasses = {
  default: "border-brand-border bg-white text-brand-ink shadow-sm",
  muted: "border-brand-border bg-brand-mist/45 text-brand-ink",
  dark: "border-brand-deep bg-brand-deep text-white shadow-panel",
};

const variantClasses = {
  surface: "",
  feature: "overflow-hidden rounded-media transition duration-300 hover:-translate-y-1 hover:shadow-editorial",
  story: "rounded-media shadow-editorial",
  resource: "rounded-media",
  stat: "rounded-none border-x-0 border-y-0 shadow-none",
};

/** Shared surface treatment for grouped content. */
export function Card({
  className,
  padding = "md",
  tone = "default",
  variant = "surface",
  ...props
}: CardProps) {
  return (
    <div
      className={cn("rounded-media border", paddingClasses[padding], toneClasses[tone], variantClasses[variant], className)}
      {...props}
    />
  );
}
```

### `components/ui/form-field.tsx`

```tsx
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
      {error ? <p className="mt-2 text-sm font-medium text-rose-600">{error}</p> : null}
    </div>
  );
}

export function TextInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(controlClassName, className)} {...props} />;
}

export function TextArea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(controlClassName, className)} {...props} />;
}
```

### `components/ui/state-message.tsx`

```tsx
import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type StateMessageProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  tone?: "empty" | "error" | "loading";
  className?: string;
};

const toneClasses = {
  empty: "border-brand-border bg-white text-brand-ink",
  error: "border-rose-200 bg-rose-50 text-rose-950",
  loading: "border-brand-border bg-brand-mist/45 text-brand-ink",
};

export function StateMessage({ title, description, action, tone = "empty", className }: StateMessageProps) {
  return (
    <section className={cn("rounded-[28px] border p-8 text-center shadow-sm", toneClasses[tone], className)}>
      <h2 className="font-heading text-2xl font-semibold">{title}</h2>
      {description ? <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </section>
  );
}
```
