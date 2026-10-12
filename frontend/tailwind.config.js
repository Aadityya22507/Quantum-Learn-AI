/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",

  content: ["./index.html", "./src/**/*.{js,jsx}"],

  theme: {
    extend: {
      colors: {
        quantum: {
          50: "#f2f0ff",
          100: "#e6e1ff",
          400: "#8b7aff",
          500: "#6c4fff",
          600: "#5636e6",
          900: "#1a0f4d",
        },
      },
    },
  },

  plugins: [],
};