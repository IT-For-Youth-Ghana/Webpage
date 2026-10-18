"use client";

import { useState } from "react";

type AdminPublishBarProps = {
  contentType: string;         // e.g., "article", "partner", "homepage"
  slugOrId?: string;           // optional identifier
  previewHref?: string;        // optional preview URL
};

export function AdminPublishBar({ contentType, slugOrId, previewHref }: AdminPublishBarProps) {
  const [busy, setBusy] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  async function handleRevalidate() {
    setBusy("revalidate");
    setMessage("");
    try {
      const res = await fetch("/api/admin/revalidate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ contentType, slug: slugOrId ?? null }),
      });
      const data = await res.json();
      setMessage(data.success ? "Revalidation triggered" : data.message ?? "Revalidation failed");
    } catch {
      setMessage("Revalidation error");
    } finally {
      setBusy("");
    }
  }

  return (
    <div className="rounded-2xl border border-brand-border bg-white p-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={!!busy}
          className="rounded-full bg-slate-950 px-4 py-2 text-xs font-bold text-white disabled:opacity-60"
          onClick={handleRevalidate}
        >
          {busy === "revalidate" ? "Revalidating…" : "Revalidate public pages"}
        </button>
        {previewHref ? (
          <a
            href={previewHref}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
          >
            Preview
          </a>
        ) : null}
        {message && <span className="text-xs text-slate-600">{message}</span>}
      </div>
    </div>
  );
}
