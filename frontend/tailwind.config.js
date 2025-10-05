/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#24be7c",
        secondary: "#26e0be",
      },
      slate: {
        100: "#f7fafc",
        200: "#edf2f7",
        700: "#2d3748",
      },
    },
    fontFamily: {
      sans: ["Roboto", "sans-serif"],
      serif: ["Rubik", "serif"],
      mono: ["Fira Code", "monospace"],
    },
  },
  plugins: [],
};
