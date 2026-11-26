/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './*.html',
    './blog/*.html',
    './assets/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0B0F19',
          slate: '#0F172A',
          card: 'rgba(255, 255, 255, 0.035)',
          border: 'rgba(255, 255, 255, 0.08)',
          hover: 'rgba(255, 255, 255, 0.06)',
          muted: '#94A3B8',
          dim: '#64748B'
        },
        accent: {
          DEFAULT: '#C0FF00',
          hover: '#AEE600',
          glow: 'rgba(192, 255, 0, 0.35)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      boxShadow: {
        'neon': '0 0 25px -4px rgba(192, 255, 0, 0.45)',
        'neon-sm': '0 0 14px -2px rgba(192, 255, 0, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'card': '0 10px 30px -10px rgba(0, 0, 0, 0.6)'
      }
    }
  },
  plugins: []
};
