/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#14b8a6",
          dark: "#0d9488",
        },
        danger: {
          DEFAULT: "#e11d48",
          light: "#f43f5e",
        },
        background: "#f3f4f6",
        card: "#ffffff",
        "text-dark": "#1f2937",
        "text-light": "#6b7280",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        md: "0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.06)",
      },
    },
  },
  plugins: [],
};
