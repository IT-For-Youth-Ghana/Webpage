import { ContentImage } from "@/components/media/content-image";

type QuoteBlockProps = {
  quote: string;
  name: string;
  role: string;
  image?: string | null;
  className?: string;
};

export function QuoteBlock({ quote, name, role, image, className }: QuoteBlockProps) {
  return (
    <figure className={`grid items-center gap-8 border-y border-brand-border py-10 md:grid-cols-[9rem_1fr] ${className ?? ""}`}>
      <ContentImage src={image} alt={name} aspectRatio="square" className="mx-auto w-32 rounded-full md:mx-0 md:w-36" />
      <div>
        <blockquote className="font-heading text-3xl font-bold leading-tight text-brand-ink sm:text-4xl">&ldquo;{quote}&rdquo;</blockquote>
        <figcaption className="mt-6 text-base font-bold text-brand-deep">{name}<span className="ml-2 font-normal text-slate-600">{role}</span></figcaption>
      </div>
    </figure>
  );
}
