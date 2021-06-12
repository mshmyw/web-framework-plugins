const path = require("path");
const { merge } = require("webpack-merge");

const commonConfigurations = require("./common.config.js");
const { loadConfigurations } = require("./config/loader.js");
const {
  loadComponentPlugins,
  getComponentPluginBundleFilePathByName,
} = require("./plugin/loader.js");
const { loadStoryboards } = require("./storyboard/loader.js");

const packageDirectory = process.cwd();

const buildBootstrapInfo = (
  componentPluginPathPatterns,
  storyboardPathPatterns
) => {
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
  const storyboards = loadStoryboards(storyboardPathPatterns);

  return {
    components: bootstrapComponentPluginsInfo,
    storyboards: storyboards,
  };
};

const configurations = loadConfigurations(packageDirectory);
const componentPluginPathPatterns = configurations.plugin?.components || [];
const storyboardPathPatterns = configurations.storyboards || [];

module.exports = merge(commonConfigurations, {
  mode: "development",
  devServer: {
    contentBase: "dist",
    open: true,
    port: configurations.server?.port || 8888,
    before: (app) => {
      app.get("/api/bootstrap", (request, response) => {
        response.json(
          buildBootstrapInfo(
            componentPluginPathPatterns,
            storyboardPathPatterns
          )
        );
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
    historyApiFallback: true,
  },
  devtool: "source-map",
});
