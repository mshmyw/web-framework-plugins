const { babel } = require("@rollup/plugin-babel");
const typescript = require("rollup-plugin-typescript2");

const getBabelPluginConfigurations = () => {
  return babel({
    babelHelpers: "runtime",
  });
};

const getTypeScriptPluginConfigurations = () => {
  return typescript();
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
      getTypeScriptPluginConfigurations(),
    ],
  };
};

module.exports = {
  getKernelRollupConfigurations,
};
