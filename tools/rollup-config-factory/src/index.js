const { babel } = require("@rollup/plugin-babel");
const typescript = require("@rollup/plugin-typescript");

const getRollupConfigurations = () => {
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

const getBabelPluginConfigurations = () => {
  return babel({
    babelHelpers: "runtime",
  });
};

const getTypeScriptPluginConfigurations = () => {
  return typescript();
};

module.exports = {
  getRollupConfigurations,
};
