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
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
}
