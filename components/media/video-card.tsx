import { Play } from "lucide-react";

import { ContentImage } from "@/components/media/content-image";
import { cn } from "@/lib/utils/cn";

type VideoCardProps = {
  thumbnail?: string | null;
  title: string;
  videoUrl?: string | null;
  className?: string;
};

/** A thumbnail-first video link that remains useful when no video has been supplied. */
export function VideoCard({ thumbnail, title, videoUrl, className }: VideoCardProps) {
  const media = <ContentImage src={thumbnail} alt={title} aspectRatio="landscape" overlay imageClassName="group-hover:scale-105" />;

  if (!videoUrl?.trim()) return <div className={className}>{media}</div>;

  return (
    <a
      href={videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Watch ${title}`}
      className={cn("group relative block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-4", className)}
    >
      {media}
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-brand-accent shadow-editorial transition duration-300 group-hover:scale-110">
          <Play className="ml-1 h-6 w-6 fill-current" aria-hidden="true" />
        </span>
      </span>
    </a>
  );
}
