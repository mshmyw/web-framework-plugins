const replace = require("@rollup/plugin-replace");

const {
  getBabelPluginConfigurations,
  getBabelTransformRuntimePluginConfiguration,
  getTypeScriptPluginConfigurations,
  getNodeResolvePluginConfigurations,
  getCommonJSPluginConfigurations,
} = require("./common.js");

const getReplacePluginConfigurations = () => {
  return replace({
    "process.env.NODE_ENV": JSON.stringify("production"),
    preventAssignment: true,
  });
};

const getUtilRollupConfigurations = () => {
  return {
    input: "src/index.ts",
    output: [
      {
        name: "webFrameworkUtil",
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
      getReplacePluginConfigurations(),
    ],
  };
};

module.exports = {
  getUtilRollupConfigurations,
};
