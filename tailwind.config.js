/** @type {import('tailwindcss').Config} */
const { heroui } = require("@heroui/react");

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [heroui({
    themes: {
      light: {
        colors: {
          background: "#FFFFFF",
          foreground: "#11181C",
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
            50: "#f2eafa",
            100: "#e4d4f4",
            200: "#c9a9e9",
            300: "#ae7ede",
            400: "#9353d3",
            500: "#7828c8",
            600: "#6020a0",
            700: "#481878",
            800: "#301050",
            900: "#180828",
            DEFAULT: "#7828c8",
            foreground: "#ffffff",
          },
          success: {
            DEFAULT: "#17c964",
            foreground: "#ffffff",
          },
          warning: {
            DEFAULT: "#f5a524",
            foreground: "#ffffff",
          },
          danger: {
            DEFAULT: "#f31260",
            foreground: "#ffffff",
          },
        },
      },
      dark: {
        colors: {
          background: "#000000",
          foreground: "#ECEDEE",
          primary: {
            DEFAULT: "#0072f5",
            foreground: "#ffffff",
          },
          secondary: {
            DEFAULT: "#7828c8",
            foreground: "#ffffff",
          },
        },
      },
    },
  })],
}
