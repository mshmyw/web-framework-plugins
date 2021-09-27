const lodash = require("lodash");
const HTMLWebpackPlugin = require("html-webpack-plugin");

const getHTMLWebpackPlugin = (customOptions) => {
  const defaultOptions = {
    template: "src/index.ejs",
    inject: false,
  };
  const options = lodash.merge(defaultOptions, customOptions);
  return new HTMLWebpackPlugin(options);
};

module.exports = {
  getHTMLWebpackPlugin,
};
