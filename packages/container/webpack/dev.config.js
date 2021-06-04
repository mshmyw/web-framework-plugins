const path = require("path");
const { merge } = require("webpack-merge");

const commonConfigurations = require("./common.config.js");
const { loadConfigurations } = require("./config/loader.js");
const {
  loadComponentPlugins,
  getComponentPluginBundleFilePathByName,
} = require("./plugin/loader.js");

const packageDirectory = process.cwd();

const buildBootstrapInfo = (componentPluginPathPatterns) => {
  const componentPlugins = loadComponentPlugins(componentPluginPathPatterns);

  const bootstrapComponentPluginsInfo = componentPlugins.map(
    (componentPlugin) => {
      return {
        name: componentPlugin.name,
        uri: `/plugin/${componentPlugin.name}.js`,
        components: componentPlugin.components,
      };
    }
  );

  return {
    components: bootstrapComponentPluginsInfo,
  };
};

const configurations = loadConfigurations(packageDirectory);
const componentPluginPathPatterns = configurations.plugin?.components || [];

module.exports = merge(commonConfigurations, {
  mode: "development",
  devServer: {
    contentBase: "dist",
    open: true,
    port: configurations.server?.port || 8888,
    before: (app) => {
      app.get("/api/bootstrap", (request, response) => {
        response.json(buildBootstrapInfo(componentPluginPathPatterns));
      });

      app.get("/kernel.js", (request, response) => {
        response.sendFile(
          path.join(packageDirectory, "../kernel/dist/index.js")
        );
      });

      app.get(
        "/component-plugin/:componentPluginName.js",
        (request, response) => {
          const componentPluginBundleFilePath =
            getComponentPluginBundleFilePathByName(
              componentPluginPathPatterns,
              request.params.componentPluginName
            );
          if (componentPluginBundleFilePath == null) {
            response.sendStatus(404);
          } else {
            response.sendFile(componentPluginBundleFilePath);
          }
        }
      );
    },
  },
  devtool: "source-map",
});
