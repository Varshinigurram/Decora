/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: '#F6F3ED',
          card: '#FFFFFF',
          subtle: '#EDE9E0',
          base: '#F6F3ED',
        },
        sand: {
          DEFAULT: '#D8C8B5',
          border: '#D8C8B5',
          light: '#E6DCCF',
        },
        taupe: {
          DEFAULT: '#A58B70',
          muted: '#8D735A',
        },
        forest: {
          DEFAULT: '#35483D',
          dark: '#2A3A31',
          light: '#425A4C',
        },
        charcoal: {
          DEFAULT: '#292824',
          primary: '#292824',
          muted: '#59564F',
          dark: '#1C1917',
        },
        accent: {
          success: '#35483D',
          warning: '#B46536',
          error: '#9B2C2C',
          gold: '#C5A059',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'sm': '2px',
        DEFAULT: '4px',
        'md': '6px',
        'lg': '8px',
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(41, 40, 36, 0.04), 0 1px 2px rgba(41, 40, 36, 0.02)',
        'elevated': '0 6px 16px rgba(41, 40, 36, 0.06), 0 2px 4px rgba(41, 40, 36, 0.03)',
        'dropdown': '0 10px 24px rgba(41, 40, 36, 0.08)',
        'modal': '0 20px 48px rgba(41, 40, 36, 0.12)',
      }
    },
  },
  plugins: [],
};
