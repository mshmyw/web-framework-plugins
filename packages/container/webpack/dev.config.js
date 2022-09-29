const path = require("path");

const { merge } = require("webpack-merge");

const { getHTMLWebpackPlugin } = require("./common.js");
const commonConfigurations = require("./common.config.js");
const { loadConfigurations } = require("./configuration/loader.js");
const {
  loadPlugins,
  getPluginBundleFilePathByName,
} = require("./plugin/loader.js");
const { loadStoryboards } = require("./storyboard/loader.js");
const { WebSocketServer } = require("./web-socket/server.js");
const { Watcher } = require("./web-socket/watcher.js");

const packageDirectoryPath = process.cwd();

const buildBootstrapInfo = (
  libraryPluginPathPatterns,
  componentPluginPathPatterns,
  storyboardPathPatterns
) => {
  const libraryPlugins = loadPlugins(libraryPluginPathPatterns);
  const bootstrapLibraryPluginsInfo = libraryPlugins.map((libraryPlugin) => {
    return {
      name: libraryPlugin.name,
      uri: `/library-plugin/${libraryPlugin.name}.js`,
    };
  });

  const componentPlugins = loadPlugins(componentPluginPathPatterns);
  const bootstrapComponentPluginsInfo = componentPlugins.map(
    (componentPlugin) => {
      return {
        name: componentPlugin.name,
        uri: `/component-plugin/${componentPlugin.name}.js`,
        components: componentPlugin.components,
      };
    }
  );

  const storyboards = loadStoryboards(storyboardPathPatterns);

  return {
    plugins: {
      library: bootstrapLibraryPluginsInfo,
      component: bootstrapComponentPluginsInfo,
    },
    storyboards: storyboards,
  };
};

const configurations = loadConfigurations(packageDirectoryPath);
const libraryPluginPathPatterns = configurations.plugins?.library || [];
const componentPluginPathPatterns = configurations.plugins?.component || [];
const storyboardPathPatterns = configurations.storyboards || [];

module.exports = merge(commonConfigurations, {
  mode: "development",
  devServer: {
    open: true,
    port: configurations.server?.port || 8888,
    static: {
      directory: "dist",
    },
    onBeforeSetupMiddleware: (devServer) => {
      const app = devServer.app;
      app.get("/api/bootstrap", (request, response) => {
        response.json(
          buildBootstrapInfo(
            libraryPluginPathPatterns,
            componentPluginPathPatterns,
            storyboardPathPatterns
          )
        );
      });

      app.get("/kernel.js", (request, response) => {
        response.sendFile(
          path.join(packageDirectoryPath, "../kernel/dist/index.js")
        );
      });

      app.get("/util.js", (request, response) => {
        response.sendFile(
          path.join(packageDirectoryPath, "../utils/dist/index.js")
        );
      });

      app.get("/library-plugin/:libraryPluginName.js", (request, response) => {
        const libraryPluginBundleFilePath = getPluginBundleFilePathByName(
          libraryPluginPathPatterns,
          request.params.libraryPluginName
        );
        if (libraryPluginBundleFilePath == null) {
          response.sendStatus(404);
        } else {
          response.sendFile(libraryPluginBundleFilePath);
        }
      });

      app.get(
        "/component-plugin/:componentPluginName.js",
        (request, response) => {
          const componentPluginBundleFilePath = getPluginBundleFilePathByName(
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

      const websocketServer = new WebSocketServer(
        configurations.webSocketServer.port
      );
      const watcher = new Watcher([
        ...componentPluginPathPatterns.map((componentPluginPathPattern) =>
          path.join(componentPluginPathPattern, "*")
        ),
        ...libraryPluginPathPatterns.map((libraryPluginPathPattern) =>
          path.join(libraryPluginPathPattern, "*")
        ),
      ]);
      watcher.listenChangeEvent(() => {
        websocketServer.sendReloadCommand();
      });
    },
    historyApiFallback: true,
  },
  plugins: [
    getHTMLWebpackPlugin({
      websocketEnabled: configurations.webSocketServer.enabled,
      websocketHost: "localhost",
      websocketPort: configurations.webSocketServer.port,
    }),
  ],
  devtool: "source-map",
});
