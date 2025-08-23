/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin';

export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/styles/**/*.{css,scss}',
  ],
  theme: {
    extend: {
      fontFamily: {
        moranga: ['var(--font-moranga)', 'sans-serif'],
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
    },
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-glow': (value) => {
            let glowColor = value;

            if (value.startsWith('#')) {
              const hex = value.replace('#', '');
              const r = parseInt(hex.substr(0, 2), 16);
              const g = parseInt(hex.substr(2, 2), 16);
              const b = parseInt(hex.substr(4, 2), 16);
              glowColor = `rgba(${r}, ${g}, ${b}, 0.8)`;
            }

            return {
              '--glow-color': glowColor,
              textShadow: `0 0 8px var(--glow-color)`, // utile sinon rien ne s’applique
            };
          },
        },
        { values: theme('colors'), type: 'color' },
      );
    }),
  ],
};
