/**
 * Capsule design language.
 *
 * The signature form is a circular media element merging with a text block
 * into one continuous pill, so the two read as a single object. These are the
 * shared parts, each separately replaceable: a page can use the shell with
 * static content and no slideshow, or wrap the controller around content that
 * is not a capsule at all.
 */
export { CapsuleShell } from "@/components/capsule/capsule-shell";
export { CapsulePageHero } from "@/components/capsule/capsule-page-hero";
export { CapsuleMedia } from "@/components/capsule/capsule-media";
export { CapsuleContent } from "@/components/capsule/capsule-content";
export { CapsuleActions } from "@/components/capsule/capsule-actions";
export { CapsuleStage } from "@/components/capsule/capsule-stage";
export { SlideshowControls } from "@/components/capsule/slideshow-controls";
export { useSlideshow, type SlideshowState } from "@/components/capsule/use-slideshow";
export { splitHeading } from "@/components/capsule/split-heading";
