/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'sf-bg': '#0D0D0D',
        'sf-card': '#1F1F1F',
        'sf-primary': '#FF4C29',
        'sf-secondary': '#FF7A50',
        'sf-text': '#F5F5F5',
        'sf-muted': '#9CA3AF',
      },
      fontFamily: {
        'display': ['"Bebas Neue"', 'cursive'],
        'body': ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
