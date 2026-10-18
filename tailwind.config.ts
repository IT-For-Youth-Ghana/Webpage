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
        heading: ["var(--font-heading)"],
        sans: ["var(--font-body)"],
      },

      /**
       * The reading sizes, brought up to the scale docs/redesign/design-system.md
       * already specifies.
       *
       * The document sets body at 1.0625rem/1.70 and long-form body at
       * 1.125rem/1.85, and app/globals.css sets `body { font-size: 1.0625rem }`
       * to match. The components never did: Tailwind's `text-sm` is 0.875rem in
       * absolute rem, so 784 paragraphs rendered at 14px inside a 17px document
       * and the site read three points smaller than it was designed to.
       *
       * Each size carries its own line height so a paragraph cannot pick up a
       * larger size and keep its old leading. `app/type-scale.test.ts` holds the
       * floor.
       */
      fontSize: {
        xs: ["0.8125rem", { lineHeight: "1.5" }],
        sm: ["0.9375rem", { lineHeight: "1.6" }],
        base: ["1.0625rem", { lineHeight: "1.7" }],
        lg: ["1.125rem", { lineHeight: "1.85" }],
      },


      colors: {
        brand: {
          primary: "#1E72BA",
          "primary-dark": "#0152BE",
          "primary-light": "#E8F1FA",
          secondary: "#0152BE",
          accent: "#D70B52",
          "accent-dark": "#B00944",
          // The logo crimson reaches only 2.8:1 on brand-deep, so it cannot carry
          // text on a navy panel. This tint is the on-dark voice of the same hue
          // and clears 4.5:1 over the panel and over the hero's crimson glow.
          // `lib/utils/contrast.test.ts` holds that floor, including against the
          // composite the hero's 22% crimson glow makes over the navy.
          "accent-on-dark": "#FF5C86",
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
        // The hero copy panel: crimson bleeding into the navy behind the headline,
        // the way docs/design_templates/02-who-we-are.html blends gold into navy.
        "hero-copy": "radial-gradient(circle at 16% 20%, rgba(215,11,82,0.22), transparent 30%)",
      },
    },
  },
  plugins: [],
};

export default config;
