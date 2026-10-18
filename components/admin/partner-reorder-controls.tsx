"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Loader2 } from "lucide-react";

type Props = {
  id: string;
  order: number;
};

export function PartnerReorderControls({ id, order }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState<"up" | "down" | null>(null);

  async function updateOrder(delta: number) {
    setBusy(delta < 0 ? "up" : "down");
    try {
      const resp = await fetch(`/api/admin/partners/${id}/order`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: order + delta }),
      });
      if (!resp.ok) {
        // silent fail; table refresh will keep old value
      }
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => updateOrder(-1)}
        disabled={busy !== null}
        title="Move up"
        className="rounded-full border border-brand-border p-2 text-brand-ink disabled:opacity-50"
      >
        {busy === "up" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
      </button>
      <button
        type="button"
        onClick={() => updateOrder(1)}
        disabled={busy !== null}
        title="Move down"
        className="rounded-full border border-brand-border p-2 text-brand-ink disabled:opacity-50"
      >
        {busy === "down" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowDown className="h-4 w-4" />}
      </button>
    </div>
  );
}
