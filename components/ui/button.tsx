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
