/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    "text-gray-800",
    "dark:text-white",
    "bg-white",
    "dark:bg-gray-900",
    "text-gray-900",
    "dark:text-gray-100",
  ],
};
