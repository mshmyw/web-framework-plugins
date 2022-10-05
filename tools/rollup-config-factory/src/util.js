const {
  getBabelPluginConfigurations,
  getTypeScriptPluginConfigurations,
  getNodeResolvePluginConfigurations,
  getCommonJSPluginConfigurations,
  getReplacePluginConfigurations,
} = require("./common.js");

const getUtilRollupConfigurations = () => {
  return {
    input: "src/index.ts",
    output: [
      {
        name: "webFrameworkUtil",
        file: "dist/index.js",
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      getBabelPluginConfigurations(),
      getTypeScriptPluginConfigurations(),
      getNodeResolvePluginConfigurations(),
      getCommonJSPluginConfigurations(),
      getReplacePluginConfigurations(),
    ],
  };
};

module.exports = {
  getUtilRollupConfigurations,
};
