import type { Config } from 'tailwindcss'

/**
 * Seahorse Suites brand theme.
 * Palette built around brand primary #40d6dc ("ocean-400").
 */
export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        ocean: {
          50: '#effcfd',
          100: '#d6f6f9',
          200: '#b2edf2',
          300: '#7de1ea',
          400: '#40d6dc', // ★ brand primary
          500: '#22b9c2',
          600: '#1a95a3',
          700: '#1b7885',
          800: '#1e616c',
          900: '#1d515c',
          950: '#0b333a'
        },
        'ocean-light': '#7de1ea',
        'ocean-dark': '#0b333a',
        sand: {
          50: '#fbf9f4',
          100: '#f6f0e4',
          200: '#eadfc8',
          300: '#dcc9a4',
          400: '#ccae7e',
          500: '#c09a63',
          DEFAULT: '#f6f0e4'
        }
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['Quicksand', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      letterSpacing: {
        brand: '0.08em',
        'brand-wide': '0.22em'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' }
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateX(-32px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        drift: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'fade-up': 'fade-up 0.7s ease-out both',
        'slide-in': 'slide-in 0.7s ease-out both',
        drift: 'drift 18s linear infinite'
      }
    }
  }
}
