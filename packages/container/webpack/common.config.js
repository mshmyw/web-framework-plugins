const path = require("path");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const packageDirectoryPath = process.cwd();

module.exports = {
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        use: "babel-loader",
        test: /\.(js|ts)x?$/,
        exclude: /node_modules\//,
      },
    ],
  },
  resolve: {
    extensions: [".js", ".ts", "jsx", "tsx"],
  },
  externals: {
    "@krill/web-framework-kernel": "webFrameworkKernel",
    "@krill/web-framework-utils": "webFrameworkUtil",
  },
  output: {
    path: path.join(packageDirectoryPath, "dist"),
    filename: "index.js",
    publicPath: "/",
  },
  plugins: [new CleanWebpackPlugin()],
};
