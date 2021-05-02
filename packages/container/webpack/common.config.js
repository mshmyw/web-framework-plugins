const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");

const packageDirectory = path.resolve(__dirname, "..");

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
  output: {
    path: path.resolve(packageDirectory, "dist"),
    filename: "index.js",
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HTMLWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
};
