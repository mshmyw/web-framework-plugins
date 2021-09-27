const { merge } = require("webpack-merge");

const { getHTMLWebpackPlugin } = require("./common.js");
const commonConfigurations = require("./common.config.js");

module.exports = merge(commonConfigurations, {
  mode: "production",
  plugins: [getHTMLWebpackPlugin()],
});
