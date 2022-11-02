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
      height: {
        "map-screen": ["calc(100vh - 72px)", "calc(100dvh - 72px)"],
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
}
