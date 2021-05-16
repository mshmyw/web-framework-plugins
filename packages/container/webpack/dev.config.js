const { merge } = require("webpack-merge");

const commonConfigurations = require("./common.config.js");
const { loadConfigurations } = require("./config/loader.js");
const { loadComponentPlugins } = require("./plugin/loader.js");

const packageDirectory = process.cwd();

const configurations = loadConfigurations(packageDirectory);

module.exports = merge(commonConfigurations, {
  mode: "development",
  devServer: {
    contentBase: "dist",
    open: true,
    port: configurations.server?.port || 8888,
    before: (app) => {
      app.get("/api/bootstrap", (request, response) => {
        response.json({
          components: loadComponentPlugins(
            configurations.plugin?.components || []
          ),
        });
      });
    },
  },
  devtool: "source-map",
});
