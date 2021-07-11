const { babel } = require("@rollup/plugin-babel");
const typescript = require("rollup-plugin-typescript2");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");

const getBabelPluginConfigurations = () => {
  return babel({
    babelHelpers: "runtime",
    exclude: /node_modules\//,
  });
};

const getBabelTransformRuntimePluginConfiguration = () => {
  return ["@babel/plugin-transform-runtime"];
};

const getTypeScriptPluginConfigurations = () => {
  return typescript();
};

const getNodeResolvePluginConfigurations = () => {
  return nodeResolve();
};

const getCommonJSPluginConfigurations = () => {
  return commonjs();
};

module.exports = {
  getBabelPluginConfigurations,
  getBabelTransformRuntimePluginConfiguration,
  getTypeScriptPluginConfigurations,
  getNodeResolvePluginConfigurations,
  getCommonJSPluginConfigurations,
};
