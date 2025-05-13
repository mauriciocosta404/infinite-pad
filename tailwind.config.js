/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        light: {
          primary: '#6366f1',
          secondary: '#8b5cf6',
          background: '#f8fafc',
          surface: '#ffffff',
          text: '#1e293b',
          muted: '#64748b'
        },
        dark: {
          primary: '#818cf8',
          secondary: '#a78bfa',
          background: '#0f172a',
          surface: '#1e293b',
          text: '#f1f5f9',
          muted: '#94a3b8'
        }
      }
    },
  },
  plugins: [],
};