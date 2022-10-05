import { defineConfig, loadEnv } from "vite";
import path from "path";
import fs from "fs/promises";
// import viteEslint from "vite-plugin-eslint";
import { createHtmlPlugin } from "vite-plugin-html";
import { loadConfigurations } from "./viteBuild/configuration/loader";
import {
  loadPlugins,
  getPluginBundleFilePathByName,
} from "./viteBuild/plugin/loader";
import { loadStoryboards } from "./viteBuild/storyboard/loader";
import { WebSocketServer } from "./viteBuild/web-socket/server";
import { Watcher } from "./viteBuild/web-socket/watcher";

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

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    createHtmlPlugin({
      inject: {
        data: {
          htmlWebpackPlugin: {
            options: {
              websocketEnabled: configurations.webSocketServer.enabled,
              websocketHost: "localhost",
              websocketPort: configurations.webSocketServer.port,
            },
          },
        },
      },
    }),
    {
      name: "configure-server",
      configureServer(server) {
        const app = server.middlewares;
        app.use("/api/bootstrap", (request, response) => {
          const bootstrapInfo = buildBootstrapInfo(
            libraryPluginPathPatterns,
            componentPluginPathPatterns,
            storyboardPathPatterns
          );
          response.end(JSON.stringify(bootstrapInfo));
        });

        app.use("/library-plugin", async (request, response) => {
          const libraryPluginBundleFilePath = getPluginBundleFilePathByName(
            libraryPluginPathPatterns,
            request.originalUrl.match(/\/library-plugin\/(.*?)\.js/i)[1]
          );
          const statusCode = libraryPluginBundleFilePath === null ? 404 : 200;
          response.writeHead(statusCode, {
            ...request.headers,
            "Content-Type": "application/javascript",
          });

          if (libraryPluginBundleFilePath == null) {
            response.end(null);
          } else {
            const libraryData = await fs.readFile(libraryPluginBundleFilePath);
            response.end(libraryData.toString());
          }
        });

        app.use("/component-plugin", async (request, response) => {
          const componentPluginBundleFilePath = getPluginBundleFilePathByName(
            componentPluginPathPatterns,
            request.originalUrl.match(/\/component-plugin\/(.*?)\.js/i)[1]
          );

          const statusCode = componentPluginBundleFilePath === null ? 404 : 200;
          response.writeHead(statusCode, {
            ...request.headers,
            "Content-Type": "application/javascript",
          });

          if (componentPluginBundleFilePath == null) {
            response.end(null);
          } else {
            const libraryData = await fs.readFile(
              componentPluginBundleFilePath
            );
            response.end(libraryData.toString());
          }
        });

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
    },
  ],
  server: {
    // Listening on all local IPs
    open: true,
    host: true,
    port: configurations.server.port,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
