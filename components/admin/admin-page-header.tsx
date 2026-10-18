import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

type AdminPageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  icon?: ReactNode;
  primaryAction?: {
    label: string;
    href: string;
  };
};

export function AdminPageHeader({
  eyebrow = "CMS",
  title,
  description,
  icon,
  primaryAction,
}: AdminPageHeaderProps) {
  return (
    <div className="rounded-[32px] bg-brand-deep p-8 text-white shadow-panel">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="flex gap-4">
          {icon ? (
            <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-primary text-white">
              {icon}
            </div>
          ) : null}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white">
              {eyebrow}
            </p>
            <h1 className="mt-3 font-heading text-4xl font-semibold">{title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-white/85">
              {description}
            </p>
          </div>
        </div>

        {primaryAction ? (
          <Button
            href={primaryAction.href}
            size="md"
          >
            {primaryAction.label}
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}
