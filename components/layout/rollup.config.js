const {
  getComponentPluginRollupConfigurations,
} = require("@krills/web-framework-tool-rollup-config-factory");

const globals = {
  "react-dom": "common.ReactDOM",
  react: "common.React",
  moment: "common.Moment",
  antd: "common.AntDesign",
};

module.exports = getComponentPluginRollupConfigurations(globals);
