const { merge } = require("webpack-merge");

const commonConfigurations = require("./common.config.js");

module.exports = merge(commonConfigurations, {
  mode: "development",
  devServer: {
    contentBase: "dist",
    open: true,
  },
  devtool: "source-map",
});
