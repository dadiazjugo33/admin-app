/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dash: {
          bg: '#0f1419',
          sidebar: '#0b0f13',
          panel: '#162025',
          card: '#1e2a30',
          border: '#2a3b42',
          primary: '#2dd4bf',
          accent: '#14b8a6',
          text: '#e2e8f0',
          muted: '#94a3b8',
        }
      }
    },
  },
  plugins: [],
}
