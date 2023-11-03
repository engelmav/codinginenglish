const path = require("path");
const { HotModuleReplacementPlugin } = require("webpack");

module.exports = () => ({
  devtool: false,
  entry: {
    index: path.resolve(__dirname, "../src/index.js"),
  },
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "index.js",
    library: "animo-ui",
    libraryTarget: "umd",
    globalObject: "this",
    umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.js$|jsx/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: "babel-loader",
          },
        ],
      },
    ],
  },
  
  devServer: {
    open: true,
    static: path.resolve(__dirname, "../"),
    port: 3000,
    compress: true,
  },
  plugins: [new HotModuleReplacementPlugin()],
});