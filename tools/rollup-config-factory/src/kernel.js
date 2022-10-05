const path = require("path");

const { getBabelOutputPlugin } = require("@rollup/plugin-babel");

const {
  getBabelPluginConfigurations,
  getTypeScriptPluginConfigurations,
  getNodeResolvePluginConfigurations,
  getCommonJSPluginConfigurations,
} = require("./common.js");

const getKernelRollupConfigurations = () => {
  return {
    input: "src/index.ts",
    output: [
      {
        name: "webFrameworkKernel",
        file: "dist/index.js",
        format: "esm",
        sourcemap: true,
        plugins: [
          getBabelOutputPlugin({
            allowAllFormats: true,
            configFile: path.resolve("babel.config.js"),
          }),
        ],
      },
    ],
    plugins: [
      getBabelPluginConfigurations(),
      getTypeScriptPluginConfigurations(),
      getNodeResolvePluginConfigurations(),
      getCommonJSPluginConfigurations(),
    ],
  };
};

module.exports = {
  getKernelRollupConfigurations,
};
