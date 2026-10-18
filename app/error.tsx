"use client";

import { useEffect } from "react";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="max-w-xl rounded-[32px] border border-brand-border bg-white p-10 text-center shadow-panel">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-accent">Something broke</p>
        <h1 className="mt-4 font-heading text-4xl font-semibold text-brand-ink">The rebuild hit a snag</h1>
        <p className="mt-4 text-base leading-8 text-slate-600">
          The new foundation is set up with a shared error boundary so we can recover gracefully while building.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 rounded-full bg-brand-deep px-5 py-3 text-sm font-semibold text-white"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
