/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        workspace: {
          50: '#F9FAFB', // Off-white background
          100: '#F3F4F6', // Lighter borders/hover
          200: '#E5E7EB', // Borders
          300: '#D1D5DB', // Muted text/icons
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563', // Secondary text
          700: '#374151',
          800: '#1F2937', // Charcoal text
          900: '#111827',
        },
        primary: {
          50: '#E6F0F2',
          100: '#CCE0E5',
          200: '#99C2CB',
          300: '#66A3B2',
          400: '#338598',
          500: '#00667E', // Muted teal/blue accent
          600: '#005265',
          700: '#003D4C',
          800: '#002932',
          900: '#001419',
        },
        status: {
          synced: '#10B981', // Subtle green
          offline: '#F59E0B', // Amber
          error: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Geist', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Courier New"', 'monospace'],
      },
      boxShadow: {
        'panel': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'dropdown': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
        'focus': '0 0 0 2px rgba(0, 102, 126, 0.3)',
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out forwards',
        'slide-in': 'slide-in 0.2s ease-out forwards',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
