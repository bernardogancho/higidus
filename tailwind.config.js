/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./_includes/**/*.njk",
    "./certificacoes/**/*.html",
    "./contacto/**/*.html",
    "./blog/**/*.njk",
    "./blog/**/*.md",
    "./_includes/layouts/**/*.njk",
    "./politica-de-privacidade/**/*.html",
    "./projetos/**/*.html",
    "./servicos/**/*.html",
    "./setores/**/*.html",
    "./sobre-nos/**/*.html",
    "./assets/site.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
