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
        // Premium light-theme elevation: layered, soft, with a faint top highlight
        card:  "0 1px 2px rgba(16,24,40,0.04), 0 2px 6px -1px rgba(16,24,40,0.05), 0 8px 24px -8px rgba(16,24,40,0.06)",
        cardHover: "0 2px 4px -1px rgba(16,24,40,0.06), 0 10px 24px -8px rgba(16,24,40,0.12), 0 24px 48px -16px rgba(16,24,40,0.16)",
        // Glossy surfaces: inner top sheen + soft ambient drop
        glossy: "inset 0 1px 0 0 rgba(255,255,255,0.7), 0 1px 2px rgba(16,24,40,0.04), 0 8px 24px -10px rgba(16,24,40,0.12)",
        glossyHover: "inset 0 1px 0 0 rgba(255,255,255,0.8), 0 2px 4px rgba(16,24,40,0.06), 0 18px 40px -14px rgba(16,24,40,0.20)",
        // Glossy on a dark/brand fill (primary button)
        button: "inset 0 1px 0 0 rgba(255,255,255,0.18), 0 1px 2px rgba(16,24,40,0.10), 0 8px 20px -6px rgba(124,58,237,0.35)",
        buttonHover: "inset 0 1px 0 0 rgba(255,255,255,0.24), 0 2px 4px rgba(16,24,40,0.12), 0 14px 30px -8px rgba(124,58,237,0.45)",
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
