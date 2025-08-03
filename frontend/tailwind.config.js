/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "deep-plum": "#3f1d38",
        "serene-blue": "#276ef1",
        "gold-amber": "#ffb400",
        "sky-teal": "#0ea5e9",
      },
    },
  },
  plugins: [],
};
