"use client";

import { useMemo, useState } from "react";
import { Play, X } from "lucide-react";

import type { WhatWeDoGalleryItem } from "@/types/content";
import { MediaFallback } from "@/components/media/media-fallback";

function getEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "youtu.be") return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`;
    if (parsed.hostname.includes("youtube.com")) {
      const id = parsed.searchParams.get("v") ?? parsed.pathname.split("/").filter(Boolean).pop();
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (parsed.hostname.includes("vimeo.com")) {
      const id = parsed.pathname.split("/").filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch {
    return null;
  }
  return null;
}

export function WhatWeDoGallery({ items }: { items: WhatWeDoGalleryItem[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeItem = activeIndex === null ? null : items[activeIndex];
  const embedUrl = useMemo(
    () => activeItem?.type === "video" ? getEmbedUrl(activeItem.url) : null,
    [activeItem],
  );

  return (
    <>
      <div className="grid auto-rows-[18rem] gap-4 md:grid-cols-2 lg:grid-cols-12">
        {items.map((item, index) => (
          <button
            key={`${item.url}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`group relative overflow-hidden rounded-[30px] bg-brand-deep text-left ${index % 4 === 0 ? "lg:col-span-7" : "lg:col-span-5"}`}
          >
            {item.type === "image" || item.thumbnailUrl ? (
              // A plain img intentionally permits any CMS-provided public URL.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.type === "image" ? item.url : item.thumbnailUrl} alt={item.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            ) : (
              <MediaFallback label={item.title} />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-deep via-brand-deep/15 to-transparent" />
            {item.type === "video" ? (
              <span className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-brand-accent text-white shadow-lg">
                <Play className="ml-0.5 h-5 w-5 fill-current" />
              </span>
            ) : null}
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <p className="font-heading text-xl font-bold">{item.title}</p>
              {item.description ? <p className="mt-2 max-w-xl text-base leading-6 text-white/75">{item.description}</p> : null}
            </div>
          </button>
        ))}
      </div>

      {activeItem ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 p-4" role="dialog" aria-modal="true" aria-label={activeItem.title} onClick={() => setActiveIndex(null)}>
          <div className="relative w-full max-w-6xl overflow-hidden rounded-[28px] bg-black" onClick={(event) => event.stopPropagation()}>
            <button type="button" onClick={() => setActiveIndex(null)} aria-label="Close gallery" className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80">
              <X className="h-5 w-5" />
            </button>
            <div className="aspect-video">
              {activeItem.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={activeItem.url} alt={activeItem.title} className="h-full w-full object-contain" />
              ) : embedUrl ? (
                <iframe src={embedUrl} title={activeItem.title} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              ) : (
                <video src={activeItem.url} poster={activeItem.thumbnailUrl} controls autoPlay className="h-full w-full" />
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
