import { ProcessSequence } from "@/components/content/process-sequence";
import { SectionIntro } from "@/components/content/section-intro";
import type { TrainingProcessStep } from "@/types/content";

type TrainingProcessStripProps = {
  eyebrow: string;
  title: string;
  description: string;
  steps: TrainingProcessStep[];
};

/**
 * The apply process.
 *
 * Four steps that run in order and never branch, so they get a line rather
 * than four detached cards. Previously each card led with an emoji-derived
 * icon; the numeral, the spine and the accent nodes carry that weight now.
 *
 * Shared by the Apply hub, the course listing, and the How It Works page, so
 * this one change covers three routes.
 */
export function TrainingProcessStrip({
  eyebrow,
  title,
  description,
  steps,
}: TrainingProcessStripProps) {
  if (!steps.length) return null;

  return (
    <section className="space-y-8">
      <SectionIntro eyebrow={eyebrow} title={title} description={description} />
      <ProcessSequence steps={steps} />
    </section>
  );
}
