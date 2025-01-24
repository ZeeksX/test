/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        border: {
          main: "#F9F9F9FE",
        },
        secondary: {
          bg: "#86C7ED47",
        },
        neutral: {
          bg: "#DBDBDB",
          shadow: "#00000012",
        },
        text: {
          main: "#1C1D1D",
        },
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      boxShadow: {
        cardShadow: "0px 0px 47.58px 0px",
      },
    },
  },
  plugins: [],
};
