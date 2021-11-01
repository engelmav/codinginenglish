const path = require("path");
const webpack = require("webpack");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

var outputPath = path.resolve(__dirname, "../build");

module.exports = function (env) {
  const environment = env.production ? "production" : "development";
  console.log("*** Webpack running with environment", environment);
  let plugins = [
    new webpack.DefinePlugin({
      __VERSION__: JSON.stringify("1.0.0." + Date.now()),
      __ENVIRONMENT__: JSON.stringify(environment),
      DEV_SERVER: JSON.stringify(env.DEV_SERVER),
      SERVER_MODE: false,
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./public", "index.html"),
      favicon: path.resolve(__dirname, "./public", "favicon.ico"),
    }),
  ];

  if (environment === "production") {
    const compressionPlugin = new CompressionWebpackPlugin();
    plugins.push(compressionPlugin);
  }
  if (env.spaces) {
    const UploadToCdnPlugin = require("../buildUtil");
    plugins.push(new UploadToCdnPlugin({ outputPath, s3Folder: "js" }));
  }

  const config = {
    mode: environment,
    entry: {
      mainEntry: "./src/index.js",
    },
    resolve: {
      fallback: { crypto: false },
      alias: {
        components: path.resolve(__dirname, "../web/src/UtilComponents"),
        settings: path.resolve(__dirname, "../web/src/settings"),
      },
    },
    module: {
      rules: [
        {
          test: /\.js$|jsx/,
          exclude: /(node_modules|bower_components)/,
          use: [
            {
              loader: "babel-loader",
            },
            {
              loader: "@compiled/webpack-loader",
            },
          ],
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    devServer: {
      historyApiFallback: true,
      open: true,
      compress: true,
      hot: true,
      port: 8080,
      proxy: { "/api": "http://localhost:5000" },
    },

    optimization: {
      runtimeChunk: "single",
      splitChunks: {
        chunks: "all",
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1];

              // npm package names are URL-safe, but some servers don't like @ symbols
              return `lib.${packageName.replace("@", "")}`;
            },
          },
        },
      },
    },
    output: {
      path: outputPath,
      filename: (pathData) => {
        return "[name].[contenthash:8].js";
      },
      chunkFilename: "[name].[contenthash:8].chunk.js",
      publicPath: "/",
    },
    plugins: plugins,
  };
  if (environment !== "production") {
    config["devtool"] = "eval-source-map";
  } else {
    console.log("*** Adding minification");
    config.optimization.minimize = true;
    config.optimization.minimizer = [new TerserPlugin()];
  }
  return config;
};
