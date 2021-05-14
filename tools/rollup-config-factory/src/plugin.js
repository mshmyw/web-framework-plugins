const path = require("path");

const { babel } = require("@rollup/plugin-babel");
const typescript = require("@rollup/plugin-typescript");

const { PLUGIN } = require("@chenshaorui/web-framework-tool-build-metadata");

const getBabelPluginConfigurations = () => {
  return babel({
    babelHelpers: "runtime",
  });
};

const getTypeScriptPluginConfigurations = () => {
  return typescript();
};

const getPluginRollupConfigurations = () => {
  return {
    input: "src/index.ts",
    output: [
      {
        file: path.join("dist", PLUGIN.OUTPUT_BUNDLE_FILE_NAME),
        format: "umd",
        sourcemap: true,
      },
    ],
    plugins: [
      getBabelPluginConfigurations(),
      getTypeScriptPluginConfigurations(),
    ],
  };
};

module.exports = {
  getPluginRollupConfigurations,
};
