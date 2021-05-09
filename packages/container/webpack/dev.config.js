const { merge } = require("webpack-merge");

const commonConfigurations = require("./common.config.js");
const { loadConfigurations } = require("./config/loader.js");

const packageDirectory = process.cwd();

const configurations = loadConfigurations(packageDirectory);

module.exports = merge(commonConfigurations, {
  mode: "development",
  devServer: {
    contentBase: "dist",
    open: true,
    port: configurations.server?.port || 8888,
  },
  devtool: "source-map",
});
