/* eslint-disable @typescript-eslint/no-require-imports */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      // Masukkan custom color/font kamu disini jika ada sebelumnya
    },
  },
  plugins: [
    require("@tailwindcss/typography"), // <--- Plugin Tiptap kita aman disini
  ],
};
