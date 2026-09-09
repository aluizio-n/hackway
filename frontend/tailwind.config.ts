import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
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
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      keyframes: {
        fadeIn: { from: { opacity: "0", transform: "translateY(6px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        slideUp: { from: { opacity: "0", transform: "translateY(20px)" }, to: { opacity: "1", transform: "translateY(0)" } },
      },
      animation: {
        fadeIn: "fadeIn .3s ease",
        slideUp: "slideUp .5s ease",
      },
    },
  },
  plugins: [],
};

export default config;
