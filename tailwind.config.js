/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        craft: {
          black: '#0D0D0D',
          surface: '#161616',
          surface2: '#1E1E1E',
          surface3: '#252525',
          border: '#2A2A2A',
          border2: '#333333',
          orange: '#F26419',
          'orange-dark': '#C94F0F',
          'orange-light': '#FF7A33',
          'orange-muted': 'rgba(242, 100, 25, 0.12)',
          white: '#FFFFFF',
          'gray-50': '#F5F5F5',
          'gray-100': '#E8E8E8',
          'gray-200': '#CCCCCC',
          'gray-400': '#8A8A8A',
          'gray-600': '#4A4A4A',
          teal: '#0ABFBC',
          'teal-muted': 'rgba(10, 191, 188, 0.12)',
          amber: '#F5A623',
          'amber-muted': 'rgba(245, 166, 35, 0.12)',
          red: '#E53E3E',
          'red-muted': 'rgba(229, 62, 62, 0.12)',
          green: '#38A169',
          'green-muted': 'rgba(56, 161, 105, 0.12)',
        },
      },
      fontFamily: {
        sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'grid-pattern':
          "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        'orange-gradient': 'linear-gradient(135deg, #F26419 0%, #FF7A33 100%)',
      },
      backgroundSize: {
        grid: '48px 48px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
        shimmer: 'shimmer 1.8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(0.85)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'orange-glow': '0 0 20px rgba(242, 100, 25, 0.3)',
        'orange-glow-sm': '0 0 10px rgba(242, 100, 25, 0.2)',
        card: '0 1px 3px rgba(0, 0, 0, 0.5)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.6)',
        modal: '0 20px 60px rgba(0, 0, 0, 0.8)',
      },
    },
  },
  plugins: [],
};
