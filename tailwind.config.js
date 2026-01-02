/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        green: {
          DEFAULT: "#33CC95",
          dark: "#27ae60",
        },
        red: {
          DEFAULT: "#E52E4D",
        },
        gray: {
          100: "#f0f2f5",
          300: "#d7d7d7",
          600: "#363F5F",
          800: "#202024",
        },
      },
    },
  },
  plugins: [],
};
