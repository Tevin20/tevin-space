import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'tevin-bg': '#FFFFFF',
        'tevin-text': '#111111',
        'tevin-accent': '#FF6B00',
        'tevin-product': '#F7F7F7',
      },
      fontFamily: {
        'inter-eb': ['Inter', 'sans-serif'],
        'inter-md': ['Inter', 'sans-serif'],
      },
      keyframes: {
        bubble: {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(0px)' },
        },
        pop: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.8)', opacity: '0' },
        },
      },
      animation: {
        bubble: 'bubble 6s ease-in-out infinite',
        pop: 'pop 0.6s ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;
