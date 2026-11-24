import type { Config } from "tailwindcss";

/**
 * Design tokens for Kintessa, from the brand guide (Charte graphique):
 * - paper  #F8F9F0  light yellow-green: backgrounds, paper, logo on blue (≈60 %)
 * - navy   #022264  deep blue: logo, text, dark backgrounds (≈30 %)
 * - sun    #FFDE59  yellow: slogan and small accents (≈10 %), ONLY on navy or photos,
 *                   never on the light background where it becomes unreadable.
 * Type: Literata (serif) for the name, titles and text; Homemade Apple for the
 * handwritten slogan and small touches.
 */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2.5rem" },
      screens: { "2xl": "1440px" },
    },
    extend: {
      colors: {
        paper: {
          DEFAULT: "#F8F9F0",
          /* slightly deeper tint for alternating sections and cards */
          dark: "#EEF0E2",
          deeper: "#E1E4D2",
        },
        navy: {
          DEFAULT: "#022264",
          hover: "#0B3285",
          /* softer tint of the navy for long body text */
          soft: "#38456E",
          light: "#B9C1D6",
        },
        sun: {
          DEFAULT: "#FFDE59",
          light: "#FFE77F",
        },
        white: "#FFFFFF",
      },
      fontFamily: {
        display: ['"Literata Variable"', "Literata", "Georgia", "serif"],
        script: ['"Homemade Apple"', "cursive"],
        sans: ['"Literata Variable"', "Literata", "Georgia", "serif"],
      },
      fontSize: {
        "hero-display": ["72px", { lineHeight: "76px", fontWeight: "400" }],
        "card-display": ["38px", { lineHeight: "42px", fontWeight: "400" }],
        script: ["22px", { lineHeight: "36px", fontWeight: "400" }],
        h2: ["32px", { lineHeight: "40px", fontWeight: "400" }],
        h3: ["24px", { lineHeight: "32px", fontWeight: "500" }],
        h4: ["20px", { lineHeight: "26px", fontWeight: "500" }],
        intro: ["19px", { lineHeight: "31px" }],
        body: ["17px", { lineHeight: "28px" }],
        label: ["12.8px", { lineHeight: "30px", fontWeight: "700", letterSpacing: "0.04em" }],
        tiny: ["11.2px", { lineHeight: "17.92px", letterSpacing: "1px" }],
      },
      borderRadius: {
        pill: "50px",
        card: "16px",
      },
      boxShadow: {
        card: "0 2px 12px rgba(2, 34, 100, 0.08)",
        float: "0 10px 40px rgba(2, 34, 100, 0.12)",
        arrow: "0 4px 14px rgba(0,0,0,0.18)",
      },
      maxWidth: {
        page: "1440px",
        content: "1360px",
      },
      backgroundImage: {
        dots: "radial-gradient(rgba(2,34,100,0.12) 1px, transparent 1.2px)",
        "dots-light": "radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1.2px)",
      },
      backgroundSize: {
        dots: "10px 10px",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
