const getRollupConfigurations = () => {
  return {
    input: "src/index.js",
    output: [
      {
        file: "dist/index.js",
        format: "umd",
      },
    ],
  };
};

module.exports = {
  getRollupConfigurations,
};
