import Image from "next/image";

import { cn } from "@/lib/utils/cn";

type Frame = {
  src: string;
  alt: string;
};

type OffsetFramesProps = {
  /** Two or three landscape photographs. More than three reads as a gallery. */
  frames: Frame[];
  className?: string;
};

/**
 * Stacked, offset landscape frames.
 *
 * The wide treatment for places that need vertical mass beside a tall text
 * column. Stacking landscape plates and offsetting them builds height out of
 * wide photography, which is the only honest way to fill a tall space from a
 * library that is roughly 30:1 landscape. Cropping a wide photograph into a
 * portrait hole would throw away most of the frame.
 *
 * The offset collapses on small screens, where the frames simply stack.
 */
export function OffsetFrames({ frames, className }: OffsetFramesProps) {
  const visible = frames.filter((f) => f.src?.trim()).slice(0, 3);
  if (!visible.length) return null;

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {visible.map((frame, index) => (
        <div
          key={frame.src}
          className={cn(
            "relative aspect-[16/10] overflow-hidden rounded-panel bg-brand-mist",
            // Alternating inset builds a stepped column rather than a stack of
            // identical plates. Disabled below md, where width is scarce.
            index % 2 === 1 ? "md:ml-10 lg:ml-14" : "md:mr-10 lg:mr-14",
          )}
        >
          <Image
            src={frame.src}
            alt={frame.alt}
            fill
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
