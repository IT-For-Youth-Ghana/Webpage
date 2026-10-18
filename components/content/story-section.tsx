import { ArrowRight } from "lucide-react";

import { ContentImage } from "@/components/media/content-image";
import { VideoCard } from "@/components/media/video-card";
import { Button, type ButtonVariant } from "@/components/ui/button";

type StorySectionProps = {
  eyebrow?: string;
  title: string;
  headline?: string;
  description: string;
  supportingText?: string;
  image?: string | null;
  imageAlt: string;
  imagePosition?: "left" | "right";
  videoUrl?: string | null;
  videoTitle?: string;
  action?: { label: string; href: string; variant?: ButtonVariant };
  tone?: "white" | "mist" | "navy";
};

const toneClasses = {
  white: "bg-white text-brand-ink",
  mist: "bg-brand-primary-light/45 text-brand-ink",
  navy: "bg-brand-deep text-white",
};

/** The primary reusable image-and-text rhythm for editorial page storytelling. */
export function StorySection({
  eyebrow,
  title,
  headline,
  description,
  supportingText,
  image,
  imageAlt,
  imagePosition = "left",
  videoUrl,
  videoTitle,
  action,
  tone = "white",
}: StorySectionProps) {
  const isDark = tone === "navy";
  const media = videoUrl ? <VideoCard thumbnail={image} title={videoTitle ?? title} videoUrl={videoUrl} /> : <ContentImage src={image} alt={imageAlt} aspectRatio="landscape" />;

  return (
    <section className={`${toneClasses[tone]} py-section-lg`}>
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
        <div className={imagePosition === "right" ? "lg:order-2" : ""}>{media}</div>
        <div className="max-w-xl">
          {eyebrow ? <p className={`text-sm font-bold uppercase tracking-[0.18em] ${isDark ? "text-brand-warm" : "text-brand-accent"}`}>{eyebrow}</p> : null}
          <h2 className={`mt-4 font-heading text-4xl font-bold sm:text-5xl lg:text-6xl ${isDark ? "text-white" : "text-brand-ink"}`}>{title}</h2>
          {headline ? <p className={`mt-5 text-xl font-semibold leading-snug sm:text-2xl ${isDark ? "text-white/90" : "text-brand-deep"}`}>{headline}</p> : null}
          <p className={`mt-6 text-lg leading-8 ${isDark ? "text-white/80" : "text-slate-700"}`}>{description}</p>
          {supportingText ? <p className={`mt-5 border-l-2 pl-5 text-base leading-7 ${isDark ? "border-brand-warm text-white/75" : "border-brand-accent text-slate-600"}`}>{supportingText}</p> : null}
          {action ? <Button href={action.href} variant={action.variant ?? (isDark ? "white" : "blue")} size="lg" className="mt-8">{action.label}<ArrowRight className="h-4 w-4" /></Button> : null}
        </div>
      </div>
    </section>
  );
}
