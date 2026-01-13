/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          primary: '#FF6B35',
          secondary: '#FF8C42',
          light: '#FFA366',
          lighter: '#FFD4B8',
          lightest: '#FFF2EC',
          dark: '#D84315',
          'gradient-start': '#FF8A5B',
          'gradient-end': '#FF6B35',
        },

        teal: {
          300: 'rgba(50, 184, 198, 1)',
          400: 'rgba(45, 166, 178, 1)',
          500: 'rgba(33, 128, 141, 1)',
          600: 'rgba(29, 116, 128, 1)',
          700: 'rgba(26, 104, 115, 1)',
          800: 'rgba(41, 150, 161, 1)',
        },

        cream: {
          DEFAULT: '#FFF8F3',
          50: '#FCF8F3',
          100: '#FFFEF9',
        },

        gray: {
          50: '#F8F9FA',
          100: '#F1F3F4',
          200: '#E8EAED',
          300: '#DADCE0',
          400: '#BDC1C6',
          500: '#9AA0A6',
          600: '#80868B',
          700: '#5F6368',
          800: '#3C4043',
          900: '#202124',
        },

        charcoal: {
          700: 'rgba(31, 33, 33, 1)',
          800: 'rgba(38, 40, 40, 1)',
        },

        slate: {
          500: 'rgba(98, 108, 113, 1)',
          900: 'rgba(19, 52, 59, 1)',
        },

        brown: {
          600: 'rgba(94, 82, 64, 1)',
        },

        success: '#34A853',
        warning: '#FBBC04',
        error: '#EA4335',

        red: {
          400: 'rgba(255, 84, 89, 1)',
          500: 'rgba(192, 21, 47, 1)',
        },

        text: {
          dark: '#333333',
          light: '#666666',
        },
      },

      backgroundImage: {
        'gradient-orange': 'linear-gradient(135deg, #FF6B35, #FFA366)',
        'gradient-orange-intense': 'linear-gradient(135deg, #FF8A5B, #FF6B35)',
        'gradient-teal': 'linear-gradient(135deg, rgba(45, 166, 178, 1), rgba(29, 116, 128, 1))',
        'gradient-subtle': 'linear-gradient(135deg, #FFA366, #FFF8F3)',
      },

      boxShadow: {
        'orange-sm': '0 2px 4px rgba(255, 107, 53, 0.1)',
        'orange-md': '0 4px 12px rgba(255, 107, 53, 0.15)',
        'orange-lg': '0 8px 24px rgba(255, 107, 53, 0.2)',
        'orange-hover': '0 4px 20px rgba(255, 107, 53, 0.3)',
      },
    },
  },
  plugins: [],
};
