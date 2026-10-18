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
      {description ? <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-600">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </section>
  );
}
