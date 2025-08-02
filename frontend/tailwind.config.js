/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // ✅ No need for .md here
  ],
  safelist: [
    "bg-white",
    "text-white",
    "border",
    "text-gray-600",
    "hover:bg-serene-blue",
    "hover:text-white",
    "group-hover:bg-serene-blue",
    "group-hover:text-white",
    "group-hover:border-serene-blue",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
