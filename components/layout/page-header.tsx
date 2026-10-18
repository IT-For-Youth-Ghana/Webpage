import { cn } from "@/lib/utils/cn";

type PageHeaderProps = {
  eyebrow?: string | null;
  title?: string | null;
  description?: string | null;
  align?: "left" | "center";
  as?: "h1" | "h2";
  className?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  align = "left",
  as: Heading = "h2",
  className,
}: PageHeaderProps) {
  const centered = align === "center";
  if (!eyebrow?.trim() && !title?.trim() && !description?.trim()) return null;

  return (
    <header className={cn("space-y-3", centered && "mx-auto text-center", className)}>
      {eyebrow?.trim() ? <p className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-brand-accent">{eyebrow}</p> : null}
      {title?.trim() ? <Heading className={cn("font-heading text-3xl font-bold leading-snug text-brand-ink sm:text-4xl", centered ? "mx-auto max-w-2xl" : "max-w-2xl")}>{title}</Heading> : null}
      {description?.trim() ? <p className={cn("text-base leading-[1.8] text-slate-500", centered ? "mx-auto max-w-2xl" : "max-w-2xl")}>{description}</p> : null}
    </header>
  );
}
