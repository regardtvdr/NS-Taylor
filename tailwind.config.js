import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette';

// Plugin to add Tailwind colors as CSS variables
function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );
  addBase({
    ":root": newVars,
  });
}

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        taylor: {
          DEFAULT: '#4E4D50',
          50: '#F5F5F5',
          100: '#E8E8E9',
          200: '#D1D0D2',
          300: '#B0AFB1',
          400: '#8A898B',
          500: '#6E6D6F',
          600: '#5C5B5D',
          700: '#4E4D50',
          800: '#3D3C3E',
          900: '#2C2B2D',
        },
        navy: {
          DEFAULT: '#4E4D50',
          50: '#F5F5F5',
          100: '#E8E8E9',
          200: '#D1D0D2',
          300: '#B0AFB1',
          400: '#8A898B',
          500: '#6E6D6F',
          600: '#5C5B5D',
          700: '#4E4D50',
          800: '#3D3C3E',
          900: '#2C2B2D',
        },
        teal: {
          DEFAULT: '#4E4D50',
          50: '#F5F5F5',
          100: '#E8E8E9',
          200: '#D1D0D2',
          300: '#B0AFB1',
          400: '#8A898B',
          500: '#6E6D6F',
          600: '#5C5B5D',
          700: '#4E4D50',
          800: '#3D3C3E',
          900: '#2C2B2D',
          accent: '#4E4D50',
        },
        accent: '#4E4D50',
        medical: {
          blue: '#4E4D50',
          teal: '#4E4D50',
          light: '#F9FAFB',
          gray: '#6B7280',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Poppins', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'card': '16px',
        'button': '12px',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient-shift 25s ease infinite',
        'aurora': 'aurora 60s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        aurora: {
          from: { backgroundPosition: '50% 50%, 50% 50%' },
          to: { backgroundPosition: '350% 50%, 350% 50%' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    addVariablesForColors,
  ],
}

