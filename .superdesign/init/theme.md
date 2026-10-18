# Theme

## Compact token summary

- Brand primary: `#1E72BA`; dark: `#0152BE`; light: `#E8F1FA`.
- Accent: `#D70B52`; accent dark: `#B00944`.
- Text: `#1A1A1A`; background: `#FFFFFF`; border: `#D8E5F2`.
- Display font: `Georgia, Cambria, "Times New Roman", serif`. Body font: `var(--font-inter), sans-serif`.
- Radius tokens: control `0.375rem`, media `0.75rem`, panel `1.5rem`, capsule `999px`.
- Layout: editorial, image-led, high-contrast navy/white/crimson with restrained glass surfaces.
- Tailwind breakpoints use the defaults.

## Raw sources

### `tailwind.config.ts`

```ts
/**
 * tailwind.config.ts — full updated theme.extend section
 *
 * Merge this with your existing tailwind.config.ts.
 * This replaces/extends whatever you already have under theme.extend.
 */

import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-heading)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },


      colors: {
        brand: {
          primary: "#1E72BA",
          "primary-dark": "#0152BE",
          "primary-light": "#E8F1FA",
          secondary: "#0152BE",
          accent: "#D70B52",
          "accent-dark": "#B00944",
          background: "#FFFFFF",
          muted: "#5C6672",
          card: "#FFFFFF",
          text: "#1A1A1A",
          deep: "#142850",
          ink: "#1A1A1A",
          mist: "#E8F1FA",
          border: "#D8E5F2",
          warm: "#FBE7EF",
        },
      },

      boxShadow: {
        panel: "0 8px 32px rgba(20,40,80,0.10)",
        editorial: "0 20px 50px rgba(20, 40, 80, 0.12)",
      },

      borderRadius: {
        control: "0.375rem",
        media: "0.75rem",
        panel: "1.5rem",
        capsule: "999px",
      },

      spacing: {
        "section-sm": "3.5rem",
        "section-md": "5rem",
        "section-lg": "7rem",
        "section-xl": "9rem",
      },

      animation: {
        "banner-in": "bannerIn 0.45s ease-out both",
        "hero-in": "heroIn 0.9s 0.3s both",
        marquee:   "marquee 30s linear infinite",
      },

      keyframes: {
        bannerIn: {
          from: { opacity: "0", transform: "translateY(-12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        heroIn: {
          from: { opacity: "0", transform: "translateY(22px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to:   { transform: "translateX(-50%)" },
        },
      },

      backgroundImage: {
        "hero-grid": "radial-gradient(ellipse at 60% 50%, rgba(30,114,186,0.15) 0%, rgba(20,40,80,0.95) 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
```

### `app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: light;
  --color-primary: #1E72BA;
  --color-primary-dark: #0152BE;
  --color-primary-light: #E8F1FA;
  --color-accent: #D70B52;
  --color-accent-dark: #B00944;
  --color-text: #1A1A1A;
  --color-text-muted: #5C6672;
  --color-bg: #FFFFFF;
  --color-bg-alt: #F7F9FC;
  --color-border: #D8E5F2;
  --color-card: #FFFFFF;
  --color-on-dark-muted: rgba(255, 255, 255, 0.82);
  --font-heading: Georgia, Cambria, "Times New Roman", serif;
  --font-body: var(--font-inter), sans-serif;
  /* Radius scale, split by role so nothing is arbitrary. Controls stay
     restrained because buttons and inputs should read as functional; panel
     replaces the ad-hoc rounded-[2rem] / rounded-[32px] values; capsule
     carries the capsule design language, which is full-round by definition. */
  --radius-control: 0.375rem;
  --radius-media: 0.75rem;
  --radius-panel: 1.5rem;
  --radius-capsule: 999px;
  --section-space: clamp(4.5rem, 8vw, 8rem);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-height: 100vh;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body);
  /* Slight global type scale increase */
  font-size: 1.0625rem; /* ~17px */
  line-height: 1.7;
}

a {
  color: var(--color-primary);
  text-decoration: none;
}

img {
  max-width: 100%;
  display: block;
}

summary::-webkit-details-marker {
  display: none;
}

main {
  display: block;
}

h1,
h2,
h3,
h4,
.heading {
  font-family: var(--font-heading);
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.08;
}

p {
  color: inherit;
}

main :where(p):not([class*="text-"]) {
  color: var(--color-text-muted);
}

main :where([class*="text-white"]) :where(p):not([class*="text-"]) {
  color: var(--color-on-dark-muted);
}

main :where([class*="bg-brand-deep"], [class*="from-brand-deep"], [class*="to-brand-deep"], [class*="via-brand-deep"])
  :where(p, li, small):is([class*="text-slate-"], [class*="text-gray-"], [class*="text-zinc-"], [class*="text-neutral-"]):not([class*="bg-white"] *) {
  color: var(--color-on-dark-muted);
}

main :where([class*="bg-brand-deep"], [class*="from-brand-deep"], [class*="to-brand-deep"], [class*="via-brand-deep"])
  :where(.text-brand-accent, .text-brand-deep, .text-brand-primary, .text-brand-primary-light):not([class*="bg-white"] *) {
  color: #ffffff;
}

main :where([class*="bg-brand-deep"], [class*="from-brand-deep"], [class*="to-brand-deep"], [class*="via-brand-deep"])
  :where(.bg-brand-accent):not([class*="bg-white"] *) {
  color: #ffffff;
}

@layer components {
  .itfy-button-primary,
  .itfy-button-blue,
  .itfy-button-outline-pink,
  .itfy-button-outline-blue,
  .itfy-button-ghost-light {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    border-radius: var(--radius-control);
    border: 1.5px solid transparent;
    font-weight: 700;
    transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
  }

  .itfy-button-primary:hover,
  .itfy-button-blue:hover,
  .itfy-button-outline-pink:hover,
  .itfy-button-outline-blue:hover,
  .itfy-button-ghost-light:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .itfy-button-primary {
    background: var(--color-accent);
    color: #ffffff;
  }

  .itfy-button-primary:hover {
    background: #ffffff;
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

  .itfy-button-blue {
    background: var(--color-primary);
    color: #ffffff;
  }

  .itfy-button-blue:hover {
    background: #ffffff;
    border-color: var(--color-primary);
    color: var(--color-primary);
  }

  .itfy-button-outline-pink {
    background: #ffffff;
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

  .itfy-button-outline-pink:hover {
    background: var(--color-accent);
    color: #ffffff;
  }

  .itfy-button-outline-blue {
    background: #ffffff;
    border-color: var(--color-primary);
    color: var(--color-primary);
  }

  .itfy-button-outline-blue:hover {
    background: var(--color-primary);
    color: #ffffff;
  }

  .itfy-button-ghost-light {
    background: transparent;
    border-color: rgba(255, 255, 255, 0.68);
    color: #ffffff;
  }

  .itfy-button-ghost-light:hover {
    border-color: #ffffff;
    color: #ffffff;
  }

  /* New solid rectangle button set (non-inverting) */
  .itfy-btn-solid-pink {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background: var(--color-accent);
    color: #fff;
    border-radius: 6px;
    border: 1.5px solid var(--color-accent);
    font-weight: 700;
    padding: 0.875rem 1.5rem; /* py-3.5 px-6 */
    font-size: 0.9375rem; /* text-base-ish */
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .itfy-btn-solid-pink:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.15); }
  .itfy-btn-solid-pink:focus-visible { outline: none; box-shadow: 0 0 0 2px #fff, 0 0 0 4px var(--color-accent); }

  .itfy-btn-solid-blue {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background: var(--color-primary);
    color: #fff;
    border-radius: 6px;
    border: 1.5px solid var(--color-primary);
    font-weight: 700;
    padding: 0.875rem 1.5rem;
    font-size: 0.9375rem;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .itfy-btn-solid-blue:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.15); }
  .itfy-btn-solid-blue:focus-visible { outline: none; box-shadow: 0 0 0 2px #fff, 0 0 0 4px var(--color-primary); }

  .itfy-btn-outline-on-dark {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background: #fff;
    color: var(--color-accent);
    border-radius: 6px;
    border: 1.5px solid #fff;
    font-weight: 700;
    padding: 0.875rem 1.5rem;
    font-size: 0.9375rem;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .itfy-btn-outline-on-dark:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.15); }

  .itfy-btn-underline-link {
    font-weight: 700;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
}

/* ==========================================================================
   CAPSULE PRIMITIVES
   --------------------------------------------------------------------------
   The signature form: a circular media element and a text block merging into
   one continuous pill, so the two read as a single object.

   The premise is geometric. The lens circle's radius and the shell's end-arc
   radius are the SAME radius, both derived from --capsule-h, so the outline
   has no seam anywhere along it. The left end's radius is written as
   calc(var(--capsule-h) / 2) rather than 999px on purpose: if CMS copy pushes
   the shell taller than --capsule-h, the end degrades to a rounded end whose
   corner radius still matches the lens, instead of silently desynchronising.

   Structural CSS lives here rather than in arbitrary-value utility classes
   because masks, calc() radii and responsive custom properties are unreadable
   inline, and because this follows the existing .itfy-* precedent above.
   React owns composition, content and state; this file owns the geometry.
   ========================================================================== */

.itfy-capsule {
  --capsule-h: 340px;
  position: relative;
  display: flex;
  align-items: stretch;
  width: 100%;
  min-height: var(--capsule-h);
  /* Order is top-left, top-right, bottom-right, bottom-left. The LEADING (left)
     end is a true semicircle matching the lens; the trailing end takes the
     panel radius.

     The right corners must NOT be 999px. When the radii on any edge sum to more
     than that edge's length, CSS multiplies EVERY radius by one global factor
     (Backgrounds 3, section 5.5). With 999px on the right, that factor was
     0.23, which shrank the left corners to ~53px and left the right end round:
     the capsule rendered mirrored. The two left radii now sum to exactly the
     left edge length and no other edge overflows, so the factor stays at 1 and
     these values render as written. */
  border-radius:
    calc(var(--capsule-h) / 2)
    var(--radius-panel)
    var(--radius-panel)
    calc(var(--capsule-h) / 2);
}

@media (min-width: 1024px) {
  .itfy-capsule { --capsule-h: 400px; }
}

@media (min-width: 1280px) {
  .itfy-capsule { --capsule-h: 460px; }
}

/* HERO SIZING
   ---------------------------------------------------------------------------
   The approved sketch is an inset 1.8:1 shell, not a viewport-filling leading
   lobe. The stage owns the quiet margin and the lower controls band. The shell
   owns the photograph and its blur.

   --hero-capsule-h is deliberately a different variable from --capsule-h.
   The base capsule sets --capsule-h on itself at each breakpoint, so trying to
   inherit a stage value under the same name leaves the hero stuck at 460px.
   The hero variant explicitly maps the computed value across that boundary. */
.itfy-hero-stage {
  --hero-pad-y: clamp(28px, 5vh, 56px);
  --hero-pad-x: clamp(16px, 4vw, 64px);
  --hero-controls-h: 56px;
  --capsule-max-w: 1240px;
  --hero-capsule-h: min(
    max(
      calc(100svh - 65px - 2 * var(--hero-pad-y) - var(--hero-controls-h)),
      500px
    ),
    680px
  );
  padding: var(--hero-pad-y) var(--hero-pad-x)
    calc(var(--hero-pad-y) + var(--hero-controls-h));
}

/* Doubled class beats the base breakpoint declarations. The max dimensions
   produce the sketch's roughly 1.8:1 shell on a normal landscape viewport. */
.itfy-capsule.itfy-capsule--hero {
  --capsule-h: var(--hero-capsule-h);
  --hero-media-inset: clamp(24px, 3vw, 44px);
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(420px, 1fr);
  width: auto;
  height: var(--capsule-h);
  min-height: 0;
  max-width: min(100%, var(--capsule-max-w));
  aspect-ratio: 1.8 / 1;
  justify-self: center;
  overflow: hidden;
  border-radius: var(--radius-panel);
}

/* THE CAPSULE BACKGROUND: the active lens photograph, blurred and clipped to
   the 24px shell. The surrounding hero stage stays the quiet deep navy shown in
   the sketch. */
.itfy-capsule__ground {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  border-radius: inherit;
  background: var(--color-primary-dark);
}

.itfy-capsule__ground-shot {
  position: absolute;
  inset: -42px;
  opacity: 0;
  transition: opacity 900ms ease-out;
}

.itfy-capsule__ground-shot[data-active="true"] {
  opacity: 1;
}

.itfy-capsule__ground-shot img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  filter: blur(38px) saturate(115%) brightness(0.46);
  transform: scale(1.14);
  transition: transform 10s ease-out;
}

.itfy-capsule__ground-shot[data-active="true"] img {
  transform: scale(1.06);
}

.itfy-capsule__wash {
  position: absolute;
  inset: 0;
  transition: background 900ms ease-out;
}

/* Above the shell's photographic ground. */
.itfy-capsule__media,
.itfy-capsule__content {
  position: relative;
  z-index: 2;
}

/* Tone: dark. Sits on a photographic stage and lets it read through. */
.itfy-capsule--dark {
  background: linear-gradient(
    118deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.045) 42%,
    rgba(255, 255, 255, 0.02) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow:
    0 48px 110px -34px rgba(0, 0, 0, 0.78),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(26px) saturate(125%);
  -webkit-backdrop-filter: blur(26px) saturate(125%);
}

/* The hero already carries a deliberately darkened photograph. A second glass
   fill would wash it out, and backdrop-filter would sample only the flat stage
   behind the shell. */
.itfy-capsule--hero.itfy-capsule--dark {
  background: var(--color-primary-dark);
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

/* Tone: paper. For the same form on a light editorial page. */
.itfy-capsule--paper {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  box-shadow: 0 40px 90px -34px rgba(20, 40, 80, 0.3);
}

/* --- Lens ---------------------------------------------------------------- */

.itfy-capsule__media {
  position: relative;
  flex: 0 0 auto;
  width: var(--capsule-h);
  height: var(--capsule-h);
  /* Centred, never stretched: a stretched lens stops being square the moment
     the shell grows, which would break the circle. */
  align-self: center;
}

/* In the hero the circle is a contained child, never the shell's boundary. */
.itfy-capsule--hero .itfy-capsule__media {
  display: grid;
  width: auto;
  height: auto;
  place-items: center;
  align-self: stretch;
  padding: var(--hero-media-inset);
}

.itfy-lens {
  position: absolute;
  inset: 0;
  border-radius: 50%;
}

.itfy-capsule--hero .itfy-lens {
  position: relative;
  inset: auto;
  width: 100%;
  max-width: calc(var(--capsule-h) - 2 * var(--hero-media-inset));
  aspect-ratio: 1 / 1;
}

.itfy-lens__frame {
  position: absolute;
  inset: 0;
  overflow: hidden;
  border-radius: 50%;
  /* The invisible join. The photograph dissolves across its own trailing
     flank into the shell body, so the eye reads one object rather than a
     circle placed beside a panel. A mask rather than a colour-matched
     overlay, so it holds over any backdrop. */
  -webkit-mask-image: linear-gradient(
    100deg,
    #000 0%,
    #000 52%,
    rgba(0, 0, 0, 0.55) 76%,
    transparent 96%
  );
  mask-image: linear-gradient(
    100deg,
    #000 0%,
    #000 52%,
    rgba(0, 0, 0, 0.55) 76%,
    transparent 96%
  );
}

.itfy-capsule--hero .itfy-lens__frame {
  -webkit-mask-image: none;
  mask-image: none;
}

.itfy-lens__shot {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 900ms ease-out;
}

.itfy-lens__shot[data-active="true"] {
  opacity: 1;
}

.itfy-lens__shot img {
  height: 100%;
  width: 100%;
  /* A circular crop is deliberate portraiture. In the hero, the same frame is
     also visible as the capsule-owned blurred ground. */
  object-fit: cover;
  object-position: 50% 34%;
  transform: scale(1.05);
  transition: transform 10s ease-out;
}

.itfy-lens__shot[data-active="true"] img {
  transform: scale(1);
}

.itfy-lens__veil {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  pointer-events: none;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.16) 0%,
    transparent 38%,
    rgba(0, 0, 0, 0.22) 100%
  );
}

.itfy-lens__rim {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  pointer-events: none;
  box-shadow: inset 0 0 0 1.5px rgba(255, 255, 255, 0.22);
}

/* Autoplay progress travelling the rim of the lens: the same information the
   old 3px viewport-bottom bar carried, but belonging to the capsule. */
.itfy-lens__progress {
  position: absolute;
  inset: -10px;
  overflow: visible;
  pointer-events: none;
  transform: rotate(-90deg);
}

/* --- Content ------------------------------------------------------------- */

.itfy-capsule__content {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* Closes the optical gap the mask fade opens up. */
  margin-left: clamp(-88px, -5vw, -40px);
  /* Vertical padding is deliberately tighter than it looks like it should be.
     The exact stadium only holds while the content fits inside --capsule-h;
     past that the shell grows and the left end degrades to a rounded end (the
     radius still matches the lens, so it degrades cleanly rather than
     breaking). Measured against the seeded hero copy, the generous padding put
     the default case ~9px over, so it is trimmed to keep the common case exact. */
  padding: clamp(32px, 3.6vw, 48px) clamp(40px, 5vw, 72px) clamp(32px, 3.6vw, 48px) 0;
}

.itfy-capsule--hero .itfy-capsule__content {
  margin-left: 0;
  padding:
    clamp(34px, 4vw, 56px)
    clamp(40px, 5vw, 72px)
    clamp(34px, 4vw, 56px)
    clamp(18px, 2.5vw, 40px);
}

/* --- Stacked layout ------------------------------------------------------
   Below 820px the shell becomes a vertical stadium with the lens as its TOP
   lobe. Two 999px top radii overflow the width, so CSS scales both to exactly
   width / 2, which is exactly the lens radius: coincident at every width.
   Pointer-driven flourishes are switched off rather than crammed in.
   ------------------------------------------------------------------------ */

@media (max-width: 820px) {
  .itfy-capsule {
    flex-direction: column;
    min-height: 0;
    max-width: 440px;
    margin-inline: auto;
    /* Stacked, so the lens is the LEADING lobe at the top and the top radii
       must be half the capsule WIDTH. Written as calc rather than 999px for the
       same reason as above: 999px would drag the global scaling factor down and
       crush the bottom corners from 24px to about 4px. */
    --capsule-w: min(440px, calc(100vw - 32px));
    border-radius:
      calc(var(--capsule-w) / 2)
      calc(var(--capsule-w) / 2)
      var(--radius-panel)
      var(--radius-panel);
  }

  .itfy-capsule__media {
    width: 100%;
    height: auto;
    aspect-ratio: 1 / 1;
    align-self: auto;
  }

  .itfy-lens__frame {
    -webkit-mask-image: linear-gradient(
      185deg,
      #000 0%,
      #000 56%,
      rgba(0, 0, 0, 0.55) 80%,
      transparent 98%
    );
    mask-image: linear-gradient(
      185deg,
      #000 0%,
      #000 56%,
      rgba(0, 0, 0, 0.55) 80%,
      transparent 98%
    );
  }

  .itfy-lens__shot img {
    object-position: 50% 30%;
  }

  .itfy-capsule__content {
    margin-left: 0;
    margin-top: clamp(-64px, -11vw, -36px);
    padding: 0 26px 34px;
    text-align: center;
    align-items: center;
  }

  .itfy-capsule.itfy-capsule--hero {
    display: flex;
    width: 100%;
    height: auto;
    max-height: none;
    max-width: 440px;
    aspect-ratio: auto;
    overflow: hidden;
    border-radius: var(--radius-panel);
  }

  .itfy-capsule--hero .itfy-capsule__media {
    width: 100%;
    height: auto;
    aspect-ratio: auto;
    padding: 24px 24px 16px;
  }

  .itfy-capsule--hero .itfy-lens {
    width: 100%;
    max-width: 392px;
  }

  .itfy-capsule--hero .itfy-lens__frame {
    -webkit-mask-image: none;
    mask-image: none;
  }

  .itfy-capsule--hero .itfy-capsule__content {
    margin-top: 0;
    padding: 12px 26px 34px;
  }
}

/* --- Motion -------------------------------------------------------------- */

@keyframes itfy-capsule-in {
  from { opacity: 0; transform: translateX(-40px) scale(0.975); }
  to   { opacity: 1; transform: none; }
}

.itfy-animate-capsule-in { animation: itfy-capsule-in 1s cubic-bezier(0.16, 0.84, 0.44, 1) 0.1s both; }

/* Resting, fully-visible state. Autoplay itself is disabled in the
   controller, not here, because an auto-advancing carousel is the motion
   being opted out of. */
@media (prefers-reduced-motion: reduce) {
  .itfy-animate-capsule-in {
    animation: none !important;
  }

  .itfy-capsule {
    opacity: 1 !important;
    transform: none !important;
  }

  .itfy-lens__shot,
  .itfy-lens__shot img,
  .itfy-capsule__ground-shot,
  .itfy-capsule__ground-shot img,
  .itfy-capsule__wash {
    transition: none !important;
  }

  .itfy-lens__shot img,
  .itfy-capsule__ground-shot img {
    transform: none !important;
  }
}

/* ==========================================================================
   INITIATIVE ORBIT
   --------------------------------------------------------------------------
   The capsule idea at a different scale: a row of circles where the active one
   grows rightwards into a named capsule while its circle stays put, so the
   circle becomes the capsule's leading lobe rather than being replaced by one.

   The row shrinks its inactive nodes to make space, so it still fits its
   column in both states. Resting 8*120 + 7*18 = 1086px; open
   340 + 7*92 + 7*14 = 1082px; both inside the 1100px measure. The breathing is
   deliberate: it reads as one system reacting, not a card over a static row.
   ========================================================================== */

.itfy-orbit {
  --orbit-node: 120px;
  --orbit-open: 340px;
  position: relative;
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 20px 0;
}

/* Driven by React state rather than :has(), so there is no support question
   and the open index stays the single source of truth. */
.itfy-orbit[data-open="true"] {
  --orbit-node: 92px;
  gap: 14px;
}

.itfy-orbit__node {
  position: relative;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  width: var(--orbit-node);
  height: var(--orbit-node);
  border-radius: var(--radius-capsule);
  background: none;
  text-align: left;
  transition:
    width 0.45s cubic-bezier(0.16, 0.84, 0.44, 1),
    transform 0.3s ease,
    background-color 0.35s ease,
    box-shadow 0.35s ease;
}

.itfy-orbit__node[aria-expanded="true"] {
  width: var(--orbit-open);
  background: var(--color-bg);
  box-shadow: 0 24px 60px -26px rgba(20, 40, 80, 0.35);
}

/* The lens tracks the node exactly, so the capsule's end arc and the circle
   are the same arc in every state. */
.itfy-orbit__lens {
  position: relative;
  flex: 0 0 auto;
  width: var(--orbit-node);
  height: var(--orbit-node);
  overflow: hidden;
  border-radius: 50%;
  transition: width 0.45s cubic-bezier(0.16, 0.84, 0.44, 1), height 0.45s cubic-bezier(0.16, 0.84, 0.44, 1);
}

.itfy-orbit__lens img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  object-position: 50% 36%;
  transition: transform 0.6s ease;
}

.itfy-orbit__node[aria-expanded="true"] .itfy-orbit__lens img {
  transform: scale(1.06);
}

/* Accent wash, lifting as the node opens so the photograph reads. */
.itfy-orbit__wash {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  opacity: 0.28;
  transition: opacity 0.35s ease;
}

.itfy-orbit__node[aria-expanded="true"] .itfy-orbit__wash {
  opacity: 0.1;
}

.itfy-orbit__body {
  min-width: 0;
  overflow: hidden;
  padding-left: 0;
  opacity: 0;
  transition: opacity 0.3s ease 0.05s, padding 0.45s cubic-bezier(0.16, 0.84, 0.44, 1);
}

.itfy-orbit__node[aria-expanded="true"] .itfy-orbit__body {
  opacity: 1;
  padding-left: 18px;
  padding-right: 26px;
}

/* Below 820px the proximity idea is dropped rather than shrunk: the row
   becomes a stack of already-open capsules. */
@media (max-width: 820px) {
  .itfy-orbit,
  .itfy-orbit[data-open="true"] {
    --orbit-node: 76px;
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .itfy-orbit__node,
  .itfy-orbit__node[aria-expanded="true"] {
    width: 100%;
    background: var(--color-bg);
    box-shadow: 0 10px 30px -18px rgba(20, 40, 80, 0.3);
    transform: none !important;
  }

  .itfy-orbit__body,
  .itfy-orbit__node[aria-expanded="true"] .itfy-orbit__body {
    opacity: 1;
    padding-left: 16px;
    padding-right: 18px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .itfy-orbit__node,
  .itfy-orbit__lens,
  .itfy-orbit__lens img,
  .itfy-orbit__wash,
  .itfy-orbit__body {
    transition: none !important;
  }

  .itfy-orbit__node {
    transform: none !important;
  }
}

/* ==========================================================================
   PATHWAY TREE
   --------------------------------------------------------------------------
   Column weights come in as --pathway-columns rather than an inline
   grid-template-columns, because an inline declaration outranks every utility
   class and the stacked layout below could never override it.
   ========================================================================== */

.itfy-pathway {
  display: grid;
  gap: 1.25rem;
  grid-template-columns: var(--pathway-columns, 1fr);
}

@media (max-width: 1023px) {
  .itfy-pathway {
    grid-template-columns: 1fr;
    gap: 2.25rem;
  }
}

.article-prose {
  color: var(--color-text-muted);
  font-size: 1.125rem;
  line-height: 1.95;
}

.article-prose > * + * {
  margin-top: 1.25rem;
}

.article-prose h2 {
  color: var(--color-text);
  font-family: var(--font-heading);
  font-size: clamp(2.2rem, 5.5vw, 2.9rem);
  font-weight: 700;
  line-height: 1.18;
  margin-top: 2.5rem;
}

.article-prose p {
  margin-bottom: 0;
}

.article-prose ul,
.article-prose ol {
  display: grid;
  gap: 0.75rem;
  margin-left: 1.25rem;
  padding-left: 1rem;
}

.article-prose li::marker {
  color: var(--color-accent);
}

.article-prose blockquote {
  border-left: 4px solid var(--color-accent);
  color: var(--color-text);
  font-family: var(--font-heading);
  font-size: clamp(1.4rem, 4vw, 2rem);
  font-weight: 700;
  line-height: 1.35;
  margin-top: 2rem;
  padding: 0.75rem 0 0.75rem 1.25rem;
}

.article-prose a {
  color: var(--color-primary);
  font-weight: 700;
  text-decoration: underline;
  text-decoration-color: var(--color-accent);
  text-decoration-thickness: 2px;
  text-underline-offset: 0.2em;
}

.course-prose {
  color: #475569;
  font-size: 1.0625rem;
  line-height: 1.9;
}

.course-prose > * + * {
  margin-top: 1.15rem;
}

.course-prose h1,
.course-prose h2,
.course-prose h3,
.course-prose h4 {
  color: var(--color-text);
  font-family: var(--font-heading);
  font-weight: 700;
  line-height: 1.2;
  margin-top: 2rem;
}

.course-prose h1 {
  font-size: clamp(2rem, 5vw, 2.75rem);
}

.course-prose h2 {
  font-size: clamp(1.65rem, 4vw, 2.25rem);
}

.course-prose h3,
.course-prose h4 {
  font-size: 1.35rem;
}

.course-prose p {
  margin-bottom: 0;
}

.course-prose ul,
.course-prose ol {
  display: grid;
  gap: 0.7rem;
  margin-left: 1.25rem;
  padding-left: 1rem;
}

.course-prose li::marker {
  color: var(--color-accent);
}

.course-prose a {
  color: var(--color-primary);
  font-weight: 700;
  text-decoration: underline;
  text-decoration-color: var(--color-accent);
  text-decoration-thickness: 2px;
  text-underline-offset: 0.2em;
}

.course-prose table {
  border-collapse: collapse;
  display: block;
  max-width: 100%;
  overflow-x: auto;
}

.course-prose th,
.course-prose td {
  border: 1px solid var(--color-border);
  padding: 0.75rem;
  text-align: left;
  vertical-align: top;
}

/* Color-blocked section utilities */
.section-block-accent {
  background: var(--color-accent);
  color: #fff;
}

.section-block-warm {
  background: var(--color-card);
  /* Use brand warm as a subtle backdrop via tailwind in components, this provides a default */
  background: var(--brand-warm, #FBE7EF);
}
```
