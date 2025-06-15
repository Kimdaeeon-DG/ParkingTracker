/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'b1-green': '#c8e6c9',  // 지하 1층 색상
        'b2-pink': '#f8bbd0',   // 지하 2층 색상
        'text-dark': '#212121', // 기본 텍스트 색상
      },
    },
  },
  plugins: [],
}
