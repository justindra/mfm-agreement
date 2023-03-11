/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', ...defaultTheme.fontFamily.serif],
        ['serif-title']: [
          'Playfair Display SC',
          ...defaultTheme.fontFamily.serif,
        ],
      },
      //   colors: {
      // 	...
      //   }
    },
    colors: {
      gray: colors.gray,
      gold: {
        50: '#fff7eb',
        100: '#fceed7',
        200: '#f9e5c4',
        300: '#f0d7af',
        400: '#e8ca9a',
        500: '#c9a873',
        600: '#9f8150',
        700: '#6b5531',
        800: '#332816',
        900: '#030201',
      },
      blue: {
        50: '#e8eeff',
        100: '#c1ccee',
        200: '#9daddd',
        300: '#7f92cc',
        400: '#6379bb',
        500: '#3c5398',
        600: '#233876',
        700: '#132354',
        800: '#091332',
        900: '#03060f',
      },
      red: {
        50: '#ffebeb',
        100: '#fecbcb',
        200: '#feabab',
        300: '#fc8e8e',
        400: '#fb7171',
        500: '#f64444',
        600: '#ec2525',
        700: '#d31010',
        800: '#870303',
        900: '#330000',
      },
      green: {
        50: '#fcfffe',
        100: '#d3efe6',
        200: '#aedece',
        300: '#8dceb8',
        400: '#70bda4',
        500: '#469d80',
        600: '#2a7c61',
        700: '#195b45',
        800: '#0d3a2b',
        900: '#051913',
      },
    },
  },
  plugins: [],
};
