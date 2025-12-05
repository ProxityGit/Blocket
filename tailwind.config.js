import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#e6f1fe",
          100: "#cce3fd",
          200: "#99c7fb",
          300: "#66aaf9",
          400: "#338ef7",
          500: "#0072f5",
          600: "#005bc4",
          700: "#004493",
          800: "#002e62",
          900: "#001731",
          DEFAULT: "#0072f5",
          foreground: "#ffffff",
        },
        secondary: {
          50: "#f5e6fe",
          100: "#e6ccfd",
          200: "#cd99fb",
          300: "#b366f9",
          400: "#9a33f7",
          500: "#7828c8",
          600: "#6020a0",
          700: "#481878",
          800: "#301050",
          900: "#180828",
          DEFAULT: "#7828c8",
          foreground: "#ffffff",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
}
