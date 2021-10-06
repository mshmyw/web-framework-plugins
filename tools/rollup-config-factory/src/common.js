const { babel } = require("@rollup/plugin-babel");
const typescript = require("rollup-plugin-typescript2");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const replace = require("@rollup/plugin-replace");
const postcss = require("rollup-plugin-postcss");
const copy = require("rollup-plugin-copy");

const getBabelPluginConfigurations = () => {
  return babel({
    babelHelpers: "runtime",
    exclude: /node_modules\//,
  });
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

const getReplacePluginConfigurations = () => {
  return replace({
    "process.env.NODE_ENV": JSON.stringify("production"),
    preventAssignment: true,
  });
};

const getPostCSSPluginConfigurations = () => {
  return postcss({
    plugins: [],
    extensions: [".css"],
  });
};

const getCopyPluginConfigurations = (src, dest) => {
  return copy({
    targets: [
      {
        src,
        dest,
      },
    ],
  });
};

module.exports = {
  getBabelPluginConfigurations,
  getTypeScriptPluginConfigurations,
  getNodeResolvePluginConfigurations,
  getCommonJSPluginConfigurations,
  getReplacePluginConfigurations,
  getPostCSSPluginConfigurations,
  getCopyPluginConfigurations,
};
