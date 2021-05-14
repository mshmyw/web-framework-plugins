const { babel } = require("@rollup/plugin-babel");
const typescript = require("@rollup/plugin-typescript");

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
