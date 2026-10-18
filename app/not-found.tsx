import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="max-w-xl rounded-[32px] border border-brand-border bg-white p-10 text-center shadow-panel">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-accent">404</p>
        <h1 className="mt-4 font-heading text-4xl font-semibold text-brand-ink">Page not found</h1>
        <p className="mt-4 text-base leading-8 text-slate-600">
          This route does not exist in the rebuilt information architecture yet.
        </p>
        <Link href="/" className="mt-8 inline-flex rounded-full bg-brand-deep px-5 py-3 text-sm font-semibold text-white">
          Return home
        </Link>
      </div>
    </main>
  );
}
