import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          dark: "hsl(var(--primary-dark))",
          light: "hsl(var(--primary-light))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          dark: "hsl(var(--secondary-dark))",
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
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Semantic AURA colors
        slate: {
          DEFAULT: "hsl(210 62% 15%)",
          light: "hsl(210 62% 25%)",
        },
        teal: {
          DEFAULT: "hsl(175 100% 38%)",
          dark: "hsl(175 100% 32%)",
        },
        coral: {
          DEFAULT: "hsl(6 100% 68%)",
          dark: "hsl(6 100% 58%)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
        "3xl": "calc(var(--radius) + 16px)",
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
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
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-15px) rotate(2deg)" },
        },
        "pulse-glow": {
          "0%, 100%": { 
            boxShadow: "0 0 20px hsl(var(--primary) / 0.3)",
            transform: "scale(1)"
          },
          "50%": { 
            boxShadow: "0 0 40px hsl(var(--primary) / 0.5)",
            transform: "scale(1.02)"
          },
        },
        "pulse-ring": {
          "0%": { 
            transform: "scale(0.8)",
            opacity: "1"
          },
          "100%": { 
            transform: "scale(2)",
            opacity: "0"
          },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        bounce: {
          "0%, 100%": { 
            transform: "translateY(-5%)",
            animationTimingFunction: "cubic-bezier(0.8,0,1,1)"
          },
          "50%": {
            transform: "translateY(0)",
            animationTimingFunction: "cubic-bezier(0,0,0.2,1)"
          }
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "flow-line": {
          "0%": { strokeDashoffset: "100" },
          "100%": { strokeDashoffset: "0" },
        },
        "device-activate": {
          "0%": { transform: "scale(1)", boxShadow: "0 0 0 0 hsl(var(--success) / 0)" },
          "50%": { transform: "scale(1.05)", boxShadow: "0 0 20px 4px hsl(var(--success) / 0.4)" },
          "100%": { transform: "scale(1)", boxShadow: "0 0 0 0 hsl(var(--success) / 0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 6s ease-in-out infinite",
        "float-slow": "float-slow 8s ease-in-out infinite",
        "float-delayed-1": "float 6s ease-in-out 1s infinite",
        "float-delayed-2": "float 6s ease-in-out 2s infinite",
        "float-delayed-3": "float 6s ease-in-out 3s infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "pulse-ring": "pulse-ring 1.5s ease-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "spin-slow": "spin-slow 20s linear infinite",
        bounce: "bounce 1s infinite",
        "scale-in": "scale-in 0.3s ease-out",
        "flow-line": "flow-line 2s ease-in-out infinite",
        "device-activate": "device-activate 0.6s ease-out",
      },
      transitionDuration: {
        "400": "400ms",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
