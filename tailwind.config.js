/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "'Helvetica Neue'",
          "Helvetica",
          "'Hiragino Sans'",
          "'Hiragino Kaku Gothic ProN'",
          "Arial",
          "'Yu Gothic'",
          "Meiryo",
          "sans-serif",
        ],
      },
      boxShadow: {
        main: "0px 1px 6px rgba(132, 132, 132, 0.26)",
      },
      colors: {
        bgcolor: "#212121",
        primary: "#D3F36B",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
}
