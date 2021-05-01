const { merge } = require("webpack-merge");

const commonConfigurations = require("./common.config");

module.exports = merge(commonConfigurations, {
  mode: "production",
});
