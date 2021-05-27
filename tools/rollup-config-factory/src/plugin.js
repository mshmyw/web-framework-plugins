const path = require("path");

const { babel } = require("@rollup/plugin-babel");
const typescript = require("rollup-plugin-typescript2");
const copy = require("rollup-plugin-copy");

const { PLUGIN } = require("@chenshaorui/web-framework-tool-build-metadata");

const getBabelPluginConfigurations = () => {
  return babel({
    babelHelpers: "runtime",
  });
};

const getTypeScriptPluginConfigurations = () => {
  return typescript();
};

const getCopyPluginConfigurations = () => {
  return copy({
    targets: [
      {
        src: PLUGIN.OUTPUT_DEFINITION_FILE_NAME,
        dest: "dist",
      },
    ],
  });
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
      // TODO(chenshaorui): Use a custom Rollup plugin to create definition file from codes.
      getCopyPluginConfigurations(),
    ],
  };
};

module.exports = {
  getPluginRollupConfigurations,
};
