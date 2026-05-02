import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Surface scale (lightest → most-emphasized)
        bg:      "#FAFAF9",   // off-white, very subtle warm tint
        panel:   "#FFFFFF",   // cards
        panel2:  "#F4F4F5",   // muted surface
        border:  "#E5E5EA",   // hairline borders
        border2: "#D4D4D8",   // emphasized borders

        // Text
        fg:        "#18181B", // near black
        fgMuted:   "#52525B",
        fgSubtle:  "#71717A",
        muted:     "#52525B", // legacy alias

        // Brand (constant identity)
        accent:     "#7C3AED",
        accentDim:  "#6D28D9",
        accentSoft: "#F3EFFE",

        // Time-aware ambient accent — set as CSS variables, change with hour
        time:       "rgb(var(--time-accent) / <alpha-value>)",
        timeDim:    "rgb(var(--time-accent-dim) / <alpha-value>)",
        timeSoft:   "rgb(var(--time-accent) / 0.10)",

        // Semantic
        success: "#10B981",
        warning: "#F59E0B",
        danger:  "#EF4444",
        info:    "#3B82F6",

        // Meeting room (dark stage, light chrome — Google-Meet style)
        stage:       "#0E0E10",
        stagePanel:  "#1A1A1D",
        stageBorder: "#2A2A30",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        lg:   "0.625rem",
        xl:   "0.875rem",
        "2xl":"1.125rem",
      },
      boxShadow: {
        // Light-theme shadows: subtle elevation, no heavy darkness
        card:  "0 1px 2px rgba(15, 15, 20, 0.04), 0 1px 6px rgba(15, 15, 20, 0.04)",
        cardHover: "0 4px 16px rgba(15, 15, 20, 0.08)",
        glow:  "0 0 0 1px rgb(var(--time-accent) / 0.25), 0 6px 24px rgb(var(--time-accent) / 0.25)",
        glowLg:"0 0 60px rgb(var(--time-accent) / 0.35), 0 0 0 1px rgb(var(--time-accent) / 0.20)",
      },
      keyframes: {
        "fade-in":   { from: { opacity: "0" }, to: { opacity: "1" } },
        "slide-up":  { from: { opacity: "0", transform: "translateY(8px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "slide-in-right": { from: { opacity: "0", transform: "translateX(16px)" }, to: { opacity: "1", transform: "translateX(0)" } },
        "shimmer":   { "0%": { backgroundPosition: "-400px 0" }, "100%": { backgroundPosition: "400px 0" } },
        "orb-pulse": { "0%,100%": { transform: "scale(1)", opacity: "0.85" }, "50%": { transform: "scale(1.06)", opacity: "1" } },
      },
      animation: {
        "fade-in":   "fade-in 200ms ease-out",
        "slide-up":  "slide-up 240ms ease-out",
        "slide-in-right": "slide-in-right 240ms ease-out",
        "shimmer":   "shimmer 1.5s linear infinite",
        "orb-idle":  "orb-pulse 3.5s ease-in-out infinite",
        "orb-speak": "orb-pulse 0.7s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
