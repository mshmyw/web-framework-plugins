const { merge } = require("webpack-merge");

const commonConfigurations = require("./common.config.js");

module.exports = merge(commonConfigurations, {
  mode: "production",
});
