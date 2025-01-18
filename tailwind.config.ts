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
      colors: {
        border: "hsl(var(--border))",
        bunker: {
          bg: "#1A1F2C",
          accent: "#403E43",
          danger: "#8B0000",
          warning: "#856404",
          success: "#2F4F4F",
          text: "#D3D3D3",
        },
      },
      keyframes: {
        "resource-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "threat-warning": {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(5px)" },
          "75%": { transform: "translateX(-5px)" },
        },
      },
      animation: {
        "resource-pulse": "resource-pulse 2s ease-in-out infinite",
        "threat-warning": "threat-warning 0.5s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;