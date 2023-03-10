module.exports = {
  plugins: [require.resolve('prettier-plugin-astro')],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
  singleQuote: true,
  arrowParens: 'always',
  jsxSingleQuote: true,
  bracketSameLine: true,
  tabWidth: 2,
};
