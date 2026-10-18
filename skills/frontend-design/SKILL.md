---
name: frontend-design
description: Guidance for distinctive, intentional visual design when building new UI or reshaping an existing one. Helps with aesthetic direction, typography, and making choices that don't read as templated defaults.
license: See LICENSE.txt
version: 0.1.0
authors:
  - GitHub Copilot (gpt-5)
scope: workspace
applyTo:
  - "**/*"
entrypoints:
  - command: "Design plan"
    description: "Brainstorm and propose a distinctive design plan (palette, type, layout, signature) for the current page or component."
  - command: "Critique plan"
    description: "Check plan against the brief; revise to ensure specificity and avoid templated defaults."
  - command: "Build UI"
    description: "Generate code/styles derived strictly from the approved plan, grounded in real content."
  - command: "Self-critique"
    description: "Run the quality checklist and recommend refinements with restraint."
---

# Frontend Design

Approach this as the design lead at a small studio known for giving every client a visual identity that could not be mistaken for anyone else's. The client has rejected proposals that felt templated and is paying for a distinctive point of view: make deliberate, opinionated choices about palette, typography, and layout that are specific to this brief, and take one real aesthetic risk you can justify.

## Outcomes
- A compact, specific design plan with tokens (color, type, layout, signature) that fits the brief.
- A revised plan that avoids generic defaults and documents why choices were made.
- Optional code implementation that follows the plan exactly, grounded in the subject's content.
- A self-critique pass using the quality checklist before handoff.

## Inputs to request/confirm
- Subject: one concrete topic/product/organization this page represents.
- Audience: who it is for, with 1–2 constraints (e.g., accessibility, device emphasis).
- Single job: the page’s primary goal (convert, inform, sign-up, apply, donate, etc.).
- Existing brand constraints: any must-use colors, type, logos, motion rules.
- Content reality: real or realistic copy, assets, and examples to design around.

If the brief is vague, pin it yourself with a single clear choice for subject, audience, and page job, and state it before designing.

## Design principles
- The hero is a thesis: open with the most characteristic thing in the subject’s world (headline, image, demo, interaction) chosen deliberately.
- Typography carries personality: pair a characterful display face (used with restraint) and a complementary body face; define a clear type scale with intent.
- Structure encodes truth: numbering, labels, dividers, and eyebrows should communicate real structure (sequence, hierarchy), not decorate.
- Motion with purpose: choose a few orchestrated interactions that serve the subject; avoid scattered or gratuitous effects.
- Match complexity to vision: maximalist needs craft; minimal needs precision; elegance is executing the chosen vision well.

## Process (two passes)
1) Brainstorm plan
   - Color: 4–6 named hex values with roles.
   - Type: display + body (and optional utility) families with weights/widths and usage notes.
   - Layout: a concept in one-liners plus ASCII wireframes to compare options.
   - Signature: a single unique element the page is remembered by, appropriate to the brief.

2) Review and revise
   - Compare against the brief and common defaults; if any part reads like a generic template, replace it with a choice grounded in the subject.
   - State what changed and why before coding.

3) Build (optional)
   - Derive all CSS/variables strictly from the approved plan. Keep specificity sane; avoid class/element clashes.
   - Integrate motion (if any) as a cohesive moment, not scattered effects.
   - Build with real content; avoid lorem-ipsum placeholders for final comps.

4) Self-critique
   - Spend boldness in one place (the signature). Keep surroundings disciplined.
   - Verify responsiveness, keyboard focus, prefers-reduced-motion, and contrast.
   - Remove anything that doesn’t serve the brief.

## Anti-defaults calibration
AI designs often collapse to three defaults:
1) Warm cream background + high-contrast serif + terracotta accent.
2) Near-black background + single neon accent (acid green/vermilion).
3) Broadsheet layout with hairline rules and dense columns.

Use these only if the brief calls for them explicitly; otherwise treat them as anti-goals. Spend your freedom on subject-specific choices, not on defaults.

## Writing as design material
- Words clarify; they are not decoration. Write from the end-user’s view with plain verbs and sentence case.
- Name controls by what people do (Manage notifications), not how systems are built.
- Keep action vocabulary consistent across flows (Publish → Published).
- Treat errors and empty states as instruction moments: state what happened and how to fix.

## Decision points and branching
- If the brief lacks subject/audience/job: propose one, then continue.
- If motion feels gratuitous: remove and concentrate on one orchestrated moment.
- If numbering/dividers don’t encode real structure: drop them.
- If the plan resembles a known default: re-ground choices in the subject’s materials, instruments, artifacts, and vernacular.

## Quality checklist (completion)
- Grounded subject statement and page job are explicit.
- Token system: 4–6 named colors, display/body (± utility) typefaces, type scale, spacing rules.
- Layout concept with at least one ASCII wireframe and rationale.
- One signature element identified and justified; surrounding elements restrained.
- Accessibility: focus styles visible, sufficient contrast, prefers-reduced-motion respected.
- Responsiveness verified down to small mobile; spacing and rhythm are consistent.
- Code (if produced) maps exactly to the plan; selectors avoid specificity conflicts.

## Example prompts
- "Use the frontend-design skill to propose a distinctive design plan for the Programs landing page. Audience: NGOs and educators. Single job: drive partnership inquiry."
- "Critique this draft plan against the brief and revise any templated choices."
- "Build the hero and navigation per the approved plan using our Next.js + Tailwind stack, deriving tokens into tailwind.config.ts."
- "Run the quality checklist and suggest one bold signature element and one simplification."

## Related next steps
- Tailwind token mapping skill for deriving tailwind.config.ts from the approved design tokens.
- A design-critique skill focused on accessibility and rhythm.
