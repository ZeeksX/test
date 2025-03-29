/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          main: "#1835B3",
          purple: "#7F56D9",
          danger: "#EA4335"
        },
        border: {
          main: "#F9F9F9FE",
        },
        secondary: {
          bg: "#86C7ED47",
          dark: "#86C7ED",
          variant: "#91D2F8",
        },
        neutral: {
          bg: "#DBDBDB",
          shadow: "#00000012",
          ghost: "#F2F4F7",
          border: "#D0D5DD"
        },
        text: {
          main: "#1C1D1D",
          ghost: "#98A2B3",
          placeholder: "#BFBFBF",
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
};
