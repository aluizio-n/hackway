import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    // Breakpoints mobile-first. `xs` cobre celulares pequenos (iPhone SE = 375px).
    screens: {
      xs: "420px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        bg: "#060912",
        panel: "#0A0E1A",
        sidebar: "#0A0D17",
        border: "#12172a",
        borderSoft: "#151B2E",
        accent: {
          DEFAULT: "#7C5CFF",
          dark: "#5C3FD6",
          soft: "#9B82FF",
        },
        muted: "#475569",
        subtle: "#64748B",
        text: "#E2E8F0",
        success: "#22C55E",
        warning: "#FBBF24",
        danger: "#F87171",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      keyframes: {
        fadeIn: { from: { opacity: "0", transform: "translateY(6px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        slideUp: { from: { opacity: "0", transform: "translateY(20px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        slideInLeft: { from: { transform: "translateX(-100%)" }, to: { transform: "translateX(0)" } },
        backdropIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        shimmer: { "100%": { transform: "translateX(100%)" } },
      },
      animation: {
        fadeIn: "fadeIn .3s ease",
        slideUp: "slideUp .5s ease",
        slideInLeft: "slideInLeft .25s cubic-bezier(.32,.72,0,1)",
        backdropIn: "backdropIn .2s ease",
        shimmer: "shimmer 1.6s infinite",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(.32,.72,0,1)",
      },
    },
  },
  plugins: [],
};

export default config;
