module.exports = {
  presets: [["@babel/preset-env"]],
  plugins: [
    [
      "@babel/plugin-transform-runtime",
      {
        helpers: false,
      },
    ],
    [
      "@babel/plugin-proposal-decorators",
      {
        decoratorsBeforeExport: true,
      },
    ],
    ["@babel/plugin-proposal-class-properties"],
  ],
};
