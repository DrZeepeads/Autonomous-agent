/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Nelson-GPT Color System
        primary: {
          DEFAULT: "#121212", // Charcoal - Major color
          foreground: "#FFFFFF", // White text on charcoal
        },
        secondary: {
          DEFAULT: "#B0B0B0", // Soft Gray - Least/Tertiary
          foreground: "#121212", // Charcoal text on gray
        },
        background: "#121212", // Primary background
        foreground: "#FFFFFF", // Primary text
        muted: {
          DEFAULT: "#262626", // Divider lines
          foreground: "#B0B0B0", // Secondary text
        },
        accent: {
          DEFAULT: "#FFFFFF", // Active buttons/icons
          foreground: "#121212",
        },
        destructive: {
          DEFAULT: "#FF5252", // Error/Alert color
          foreground: "#FFFFFF",
        },
        border: "#262626", // Divider lines
        input: "#1E1E1E", // Input backgrounds
        ring: "#FFFFFF",
        // Custom message bubble colors
        "user-bubble": "#2A2A2A", // User message container
        "ai-bubble": "#1E1E1E", // AI message container
        "hover-color": "#333333", // Button hover state
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
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
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-in": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "pulse-dot": {
          "0%, 80%, 100%": { transform: "scale(0)" },
          "40%": { transform: "scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "pulse-dot": "pulse-dot 1.4s infinite ease-in-out both",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

