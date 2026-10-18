"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

export type Announcement = {
  id: string;
  label: string;
  message: string;
  cta?: { label: string; href: string };
  variant?: "info" | "success" | "urgent" | "alert";
  startDate?: string;
  endDate?: string;
  countdownDate?: string;
  dismissible?: boolean;
};

type AnnouncementBarProps = {
  announcement: Announcement;
};

const variantStyles = {
  info: {
    wrap: "bg-brand-primary text-white",
    badge: "bg-white/15 text-white",
    cta: "itfy-button-outline-blue px-3.5 py-1 text-[0.72rem]",
    close: "text-white/40 hover:text-white",
  },
  success: {
    wrap: "bg-brand-primary-dark text-white",
    badge: "bg-white/15 text-white",
    cta: "itfy-button-outline-blue px-3.5 py-1 text-[0.72rem]",
    close: "text-white/45 hover:text-white",
  },
  urgent: {
    wrap: "bg-brand-accent text-white",
    badge: "bg-white/15 text-white",
    cta: "itfy-button-outline-pink px-3.5 py-1 text-[0.72rem]",
    close: "text-white/55 hover:text-white",
  },
  alert: {
    wrap: "bg-brand-accent text-white",
    badge: "bg-white/15 text-white",
    cta: "itfy-button-outline-pink px-3.5 py-1 text-[0.72rem]",
    close: "text-white/45 hover:text-white",
  },
};

const DISMISS_WINDOW_MS = 24 * 60 * 60 * 1000;

function formatCountdownLabel(countdownDate?: string) {
  if (!countdownDate) {
    return null;
  }

  const delta = new Date(countdownDate).getTime() - Date.now();
  if (Number.isNaN(delta) || delta <= 0) {
    return null;
  }

  const totalMinutes = Math.floor(delta / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);

  if (days > 0) {
    return `${days}d ${hours}h left`;
  }

  if (hours > 0) {
    return `${hours}h left`;
  }

  return `${Math.max(totalMinutes, 1)}m left`;
}

export function AnnouncementBar({ announcement }: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [countdownLabel, setCountdownLabel] = useState<string | null>(null);

  const dismissKey = useMemo(
    () => `itfy-announcement-dismissed:${announcement.id}`,
    [announcement.id],
  );

  useEffect(() => {
    const now = Date.now();
    const start = announcement.startDate ? new Date(announcement.startDate).getTime() : null;
    const end = announcement.endDate ? new Date(announcement.endDate).getTime() : null;

    if ((start && now < start) || (end && now > end)) {
      setIsVisible(false);
      return;
    }

    if (announcement.dismissible !== false) {
      const dismissedUntil = window.localStorage.getItem(dismissKey);
      if (dismissedUntil && Number(dismissedUntil) > now) {
        setIsVisible(false);
        return;
      }
    }

    setIsVisible(true);
    setCountdownLabel(formatCountdownLabel(announcement.countdownDate));

    if (!announcement.countdownDate) {
      return;
    }

    const timer = window.setInterval(() => {
      setCountdownLabel(formatCountdownLabel(announcement.countdownDate));
    }, 60_000);

    return () => window.clearInterval(timer);
  }, [
    announcement.countdownDate,
    announcement.dismissible,
    announcement.endDate,
    announcement.startDate,
    dismissKey,
  ]);

  if (!isVisible) {
    return null;
  }

  const v = variantStyles[announcement.variant ?? "urgent"];

  const dismissAnnouncement = () => {
    if (announcement.dismissible === false) {
      return;
    }

    window.localStorage.setItem(dismissKey, String(Date.now() + DISMISS_WINDOW_MS));
    setIsVisible(false);
  };

  return (
    <div className={`relative z-50 animate-banner-in ${v.wrap}`}>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-[0.2em] ${v.badge}`}
        >
          {announcement.label}
        </span>

        <p className="text-center text-sm font-medium leading-snug sm:text-left">
          {announcement.message}
        </p>

        {countdownLabel ? (
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-[0.62rem] font-bold uppercase tracking-[0.15em] ${v.badge}`}
          >
            {countdownLabel}
          </span>
        ) : null}

        {announcement.cta ? (
          <Link
            href={announcement.cta.href}
            className={`shrink-0 font-bold ${v.cta}`}
          >
            {announcement.cta.label} →
          </Link>
        ) : null}

        {announcement.dismissible !== false ? (
          <button
            onClick={dismissAnnouncement}
            aria-label="Dismiss announcement"
            className={`absolute right-4 top-1/2 -translate-y-1/2 transition ${v.close}`}
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
