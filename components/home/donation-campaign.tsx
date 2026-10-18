"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3, HeartHandshake, Users } from "lucide-react";

/* Re-exported so existing importers of this module keep working; the contract
   itself lives in types/content.ts. */
import type { DonationCampaignContent } from "@/types/content";

export type { DonationCampaignContent };

type DonationCampaignProps = {
  campaign: DonationCampaignContent;
};

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getDaysRemaining(deadline: string) {
  const deadlineTime = new Date(deadline).getTime();
  const now = Date.now();
  const diff = deadlineTime - now;

  if (Number.isNaN(deadlineTime) || diff <= 0) {
    return 0;
  }

  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function DonationCampaign({ campaign }: DonationCampaignProps) {
  const [daysRemaining, setDaysRemaining] = useState(0);

  useEffect(() => {
    setDaysRemaining(getDaysRemaining(campaign.deadline));
  }, [campaign.deadline]);

  if (campaign.active === false) {
    return null;
  }

  const currency = campaign.currency ?? "USD";
  const progress = Math.min(
    100,
    Math.round((campaign.raisedAmount / Math.max(campaign.goalAmount, 1)) * 100),
  );

  return (
    <section className="overflow-hidden bg-[linear-gradient(135deg,var(--color-primary-light)_0%,var(--color-bg)_52%,#ffffff_100%)] px-6 py-20 lg:px-10">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="relative overflow-hidden rounded-panel border border-white/15 bg-[linear-gradient(135deg,var(--color-primary-dark)_0%,var(--color-primary)_58%,var(--color-accent)_130%)] p-8 text-white shadow-[0_20px_50px_rgba(1,82,190,0.18)] sm:p-10">
          {campaign.image ? (
            <div className="absolute inset-y-0 right-0 hidden w-[42%] overflow-hidden lg:block">
              <Image
                src={campaign.image}
                alt={campaign.headline}
                fill
                sizes="40vw"
                className="object-cover opacity-25"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-brand-deep/15 via-brand-deep/35 to-brand-deep/70" />
            </div>
          ) : null}

          <div className="relative max-w-2xl space-y-6">
            <div className="space-y-3">
              <h2 className="font-heading text-5xl font-bold leading-none text-white sm:text-6xl">
                {campaign.eyebrow}
              </h2>
              <p className="font-heading text-2xl font-bold leading-tight text-white sm:text-3xl">
                {campaign.headline}
              </p>
              {campaign.description.trim() ? <p className="max-w-xl text-base leading-8 text-white/85">
                {campaign.description}
              </p> : null}
            </div>

            {campaign.supportPoints?.length ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {campaign.supportPoints.map((point) => (
                  <div
                    key={point}
                    className="rounded-panel border border-white/15 bg-white/10 px-4 py-4 text-sm leading-7 text-white/85 backdrop-blur-sm"
                  >
                    {point}
                  </div>
                ))}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <Link
                href={campaign.primaryCta.href}
                className="itfy-button-primary px-6 py-3.5 text-sm"
              >
                <HeartHandshake className="h-4 w-4" />
                {campaign.primaryCta.label}
              </Link>
              {campaign.secondaryCta ? (
                <Link
                  href={campaign.secondaryCta.href}
                  className="itfy-button-ghost-light px-6 py-3.5 text-sm"
                >
                  {campaign.secondaryCta.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        <div className="rounded-panel border border-brand-border bg-white p-8 shadow-[0_22px_55px_rgba(1,82,190,0.14)] sm:p-10">
          <div className="space-y-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-accent">
                  Campaign progress
                </p>
                <p className="mt-3 font-heading text-4xl font-bold text-brand-ink">
                  {progress}%
                </p>
              </div>
              <div className="rounded-full bg-brand-primary-light px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-deep">
                Active now
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-base text-slate-500">Raised</p>
                  <p className="font-heading text-3xl font-bold text-brand-ink">
                    {formatCurrency(campaign.raisedAmount, currency)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-base text-slate-500">Goal</p>
                  <p className="text-lg font-semibold text-brand-ink">
                    {formatCurrency(campaign.goalAmount, currency)}
                  </p>
                </div>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-brand-mist">
                <div
                  className="h-full rounded-full bg-brand-accent transition-[width] duration-700"
                  style={{ width: `${progress}%` }}
                  aria-hidden="true"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-panel border border-brand-border bg-brand-mist/50 p-5">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-brand-accent" />
                  <div>
                    <p className="text-base text-slate-500">Donors so far</p>
                    <p className="text-2xl font-bold text-brand-ink">{campaign.donorCount}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-panel border border-brand-border bg-brand-mist/50 p-5">
                <div className="flex items-center gap-3">
                  <Clock3 className="h-5 w-5 text-brand-accent" />
                  <div>
                    <p className="text-base text-slate-500">Days remaining</p>
                    <p className="text-2xl font-bold text-brand-ink">{daysRemaining}</p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-base leading-7 text-slate-500">
              Every contribution helps us cover tuition support, devices, mentorship,
              and transition-to-work opportunities for young people who are ready to
              build a future in tech.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
