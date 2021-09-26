const { getKernelRollupConfigurations } = require("./kernel.js");
const { getUtilRollupConfigurations } = require("./util.js");
const {
  getComponentPluginRollupConfigurations,
  getLibraryPluginRollupConfigurations,
} = require("./plugin.js");

module.exports = {
  getKernelRollupConfigurations,
  getUtilRollupConfigurations,
  getComponentPluginRollupConfigurations,
  getLibraryPluginRollupConfigurations,
};
