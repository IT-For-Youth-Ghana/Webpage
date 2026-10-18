import Link from "next/link";

import { ContentImage } from "@/components/media/content-image";
import { Card } from "@/components/ui/card";

type FeatureCardProps = {
  image?: string | null;
  imageAlt: string;
  category?: string;
  title: string;
  description?: string;
  href: string;
  ctaLabel?: string;
  className?: string;
};

/** Image-led editorial card for programs, stories, and resources. */
export function FeatureCard({ image, imageAlt, category, title, description, href, ctaLabel = "Read more", className }: FeatureCardProps) {
  return (
    <Card className={className} padding="none" tone="default" variant="feature">
      <ContentImage src={image} alt={imageAlt} aspectRatio="landscape" />
      <div className="p-6">
        {category ? (
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.22em] text-brand-accent">{category}</p>
        ) : null}
        <h3 className="mt-2 font-heading text-[1.4rem] font-bold leading-tight text-brand-ink">{title}</h3>
        {description ? <p className="mt-3 text-base leading-7 text-slate-700">{description}</p> : null}
        <Link href={href} className="mt-5 inline-flex items-center gap-1 text-[0.9rem] font-bold text-brand-deep transition hover:gap-2">
          {ctaLabel} →
        </Link>
      </div>
    </Card>
  );
}
