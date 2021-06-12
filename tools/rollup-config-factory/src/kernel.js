const { babel } = require("@rollup/plugin-babel");
const typescript = require("rollup-plugin-typescript2");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const replace = require("@rollup/plugin-replace");

const getBabelPluginConfigurations = () => {
  return babel({
    babelHelpers: "runtime",
    exclude: "../../node_modules/**",
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

const getReplacePluginConfigurations = () => {
  return replace({
    "process.env.NODE_ENV": JSON.stringify("production"),
    preventAssignment: true,
  });
};

const getKernelRollupConfigurations = () => {
  return {
    input: "src/index.ts",
    output: [
      {
        name: "kernel",
        file: "dist/index.js",
        format: "umd",
        sourcemap: true,
      },
    ],
    plugins: [
      getBabelPluginConfigurations(),
      getBabelTransformRuntimePluginConfiguration(),
      getTypeScriptPluginConfigurations(),
      getNodeResolvePluginConfigurations(),
      getCommonJSPluginConfigurations(),
      getReplacePluginConfigurations(),
    ],
  };
};

module.exports = {
  getKernelRollupConfigurations,
};
