"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Play, X } from "lucide-react";

import { Button } from "@/components/ui/button";

export type FeaturedStoryContent = {
  id: string;
  label: string;
  headline: string;
  quote: string;
  name: string;
  role: string;
  programme: string;
  backgroundImage: string;
  videoUrl?: string;
  primaryCtaLabel: string;
  secondaryCta: { label: string; href: string };
};

type FeaturedStoryVideoProps = {
  story: FeaturedStoryContent;
};

function toEmbedUrl(url?: string) {
  if (!url) {
    return null;
  }

  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : null;
    }

    if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname.startsWith("/embed/")) {
        return `${parsed.origin}${parsed.pathname}?autoplay=1&rel=0`;
      }

      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : null;
    }

    if (parsed.hostname.includes("vimeo.com")) {
      const id = parsed.pathname.split("/").filter(Boolean).pop();
      return id
        ? `https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0&portrait=0`
        : null;
    }
  } catch {
    return null;
  }

  return null;
}

export function FeaturedStoryVideo({ story }: FeaturedStoryVideoProps) {
  const [isOpen, setIsOpen] = useState(false);
  const embedUrl = useMemo(() => toEmbedUrl(story.videoUrl), [story.videoUrl]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <section className="bg-white px-6 pb-20 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="relative min-h-[34rem] overflow-hidden rounded-panel bg-brand-deep shadow-[0_20px_55px_rgba(12,45,90,0.2)]">
            <Image
              src={story.backgroundImage}
              alt={story.headline}
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(12,45,90,0.88)_0%,rgba(12,45,90,0.52)_46%,rgba(12,45,90,0.16)_100%)]" />

            <div className="relative flex min-h-[34rem] items-end p-6 sm:p-10">
              <div className="max-w-2xl rounded-panel bg-brand-deep/60 p-7 text-white backdrop-blur-md sm:p-9">
                <h2 className="font-heading text-5xl font-bold leading-none text-white sm:text-6xl">
                  {story.label}
                </h2>
                <p className="mt-5 font-heading text-2xl font-bold leading-tight text-white sm:text-3xl">
                  {story.headline}
                </p>
                <blockquote className="mt-5 text-base leading-8 text-white/82 sm:text-lg">
                  &ldquo;{story.quote}&rdquo;
                </blockquote>
                <div className="mt-6 border-l-2 border-brand-accent pl-4">
                  <p className="font-semibold text-white">{story.name}</p>
                  <p className="mt-1 text-base text-white/70">
                    {story.role} · {story.programme}
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    disabled={!embedUrl}
                    variant="pink"
                    size="lg"
                  >
                    <Play className="h-4 w-4" />
                    {story.primaryCtaLabel}
                  </Button>
                  <Button
                    href={story.secondaryCta.href}
                    variant="white-outline"
                    size="lg"
                  >
                    {story.secondaryCta.label}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isOpen && embedUrl ? (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-label={story.primaryCtaLabel}
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl overflow-hidden rounded-panel bg-black shadow-[0_25px_70px_rgba(0,0,0,0.45)]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/65 text-white transition hover:bg-black/80"
              aria-label="Close video"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="aspect-video">
              <iframe
                src={embedUrl}
                title={story.headline}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
