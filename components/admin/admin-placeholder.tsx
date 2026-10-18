type AdminPlaceholderProps = {
  title: string;
  description: string;
  nextSteps: string[];
};

export function AdminPlaceholder({ title, description, nextSteps }: AdminPlaceholderProps) {
  return (
    <div className="space-y-8">
      <div className="rounded-[32px] bg-slate-950 p-8 text-white shadow-panel">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-accent">CMS scaffold</p>
        <h1 className="mt-3 font-heading text-4xl font-semibold">{title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">{description}</p>
      </div>

      <div className="rounded-[32px] border border-brand-border bg-white p-8 shadow-sm">
        <h2 className="font-heading text-2xl font-semibold text-brand-ink">What is ready now</h2>
        <ul className="mt-5 grid gap-3 text-sm leading-7 text-slate-600">
          {nextSteps.map((step) => (
            <li key={step}>• {step}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
