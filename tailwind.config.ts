import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        // shadcn semantic tokens (HSL)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // SmartStay brand tokens (raw hex, design-system specified)
        bg: {
          deep: "#0A0E1A",
          surface: "#131A2E",
          elevated: "#0F1424",
        },
        brand: {
          primary: "#A78BFA",
          deep: "#8B5CF6",
        },
        success: "#5EEAD4",
        warn: "#FBBF24",
        danger: "#FB7185",

        // Text-on-dark tokens
        text: {
          primary: "rgba(255,255,255,0.95)",
          secondary: "rgba(255,255,255,0.55)",
          tertiary: "rgba(255,255,255,0.35)",
        },

        // Glass surfaces
        glass: {
          bg: "rgba(255,255,255,0.05)",
          border: "rgba(255,255,255,0.10)",
          "border-strong": "rgba(167,139,250,0.40)",
        },
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #A78BFA, #8B5CF6)",
        "ambient-gradient":
          "linear-gradient(165deg, #0A0E1A 0%, #131A2E 45%, #0F1424 100%)",
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "14px",
        xl: "22px",
      },
      spacing: {
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "6": "24px",
        "8": "32px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "breathing-dot": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
        "pulse-ring": {
          "0%, 100%": { transform: "scale(1)", opacity: "0.4" },
          "50%": { transform: "scale(1.05)", opacity: "0.7" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "20%": { opacity: "1" },
          "80%": { opacity: "1" },
          "100%": { transform: "translateY(100%)", opacity: "0" },
        },
        "success-ring": {
          "0%": { transform: "scale(0.8)", opacity: "0.6" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
        spin: {
          to: { transform: "rotate(360deg)" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-6px)" },
          "40%": { transform: "translateX(6px)" },
          "60%": { transform: "translateX(-4px)" },
          "80%": { transform: "translateX(4px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "breathing-dot": "breathing-dot 2s ease-in-out infinite",
        "pulse-ring": "pulse-ring 2.4s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
        "scan-line": "scan-line 2.8s ease-in-out infinite",
        "success-ring": "success-ring 2.4s ease-out infinite",
        spin: "spin 1s linear infinite",
        "spin-slow": "spin-slow 6s linear infinite",
        shake: "shake 0.5s ease-in-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
