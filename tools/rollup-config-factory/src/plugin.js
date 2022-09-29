const path = require("path");

const { getBabelOutputPlugin } = require("@rollup/plugin-babel");
const { PLUGIN } = require("@krill/web-framework-tool-build-metadata");

const {
  getBabelPluginConfigurations,
  getTypeScriptPluginConfigurations,
  getNodeResolvePluginConfigurations,
  getCommonJSPluginConfigurations,
  getReplacePluginConfigurations,
  getPostCSSPluginConfigurations,
  getCopyPluginConfigurations,
} = require("./common.js");

const getComponentPluginRollupConfigurations = (globals) => {
  const external = [
    "@krill/web-framework-kernel",
    "@krill/web-framework-utils",
  ];
  if (globals !== undefined && globals !== null) {
    external.push(...Object.keys(globals));
  }

  return {
    input: "src/index.ts",
    external,
    output: [
      {
        file: path.join("dist", PLUGIN.OUTPUT_BUNDLE_FILE_NAME),
        format: "umd",
        sourcemap: true,
        globals,
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
      // TODO(chenshaorui): Use a custom Rollup plugin to create definition file from codes.
      getCopyPluginConfigurations(PLUGIN.OUTPUT_DEFINITION_FILE_NAME, "dist"),
      getPostCSSPluginConfigurations(),
    ],
  };
};

const getLibraryPluginRollupConfigurations = (libraryName) => {
  return {
    input: "src/index.ts",
    output: [
      {
        name: libraryName,
        file: path.join("dist", PLUGIN.OUTPUT_BUNDLE_FILE_NAME),
        format: "umd",
        exports: "named",
      },
    ],
    plugins: [
      getBabelPluginConfigurations(),
      getTypeScriptPluginConfigurations(),
      getNodeResolvePluginConfigurations(),
      getCommonJSPluginConfigurations(),
      getReplacePluginConfigurations(),
      getPostCSSPluginConfigurations(),
      // TODO(chenshaorui): Use a custom Rollup plugin to create definition file from codes.
      getCopyPluginConfigurations(PLUGIN.OUTPUT_DEFINITION_FILE_NAME, "dist"),
    ],
  };
};

module.exports = {
  getComponentPluginRollupConfigurations,
  getLibraryPluginRollupConfigurations,
};
