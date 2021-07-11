const {
  getBabelPluginConfigurations,
  getBabelTransformRuntimePluginConfiguration,
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
        format: "umd",
        sourcemap: true,
      },
    ],
    plugins: [
      getBabelPluginConfigurations(),
      getBabelTransformRuntimePluginConfiguration(),
      getTypeScriptPluginConfigurations(),
      getNodeResolvePluginConfigurations(),
      getCommonJSPluginConfigurations(),
    ],
  };
};

module.exports = {
  getKernelRollupConfigurations,
};
