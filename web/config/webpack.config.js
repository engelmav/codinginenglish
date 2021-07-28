const path = require("path");
const webpack = require("webpack");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const zopfli = require("@gfx/zopfli");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const ASSET_PATH = process.env.ASSET_PATH || "/";

module.exports = function (env) {
  const environment = env.production ? "production" : "development";
  console.log("*** Webpack running with environment", environment);
  let plugins = [
    new webpack.DefinePlugin({
      __VERSION__: JSON.stringify("1.0.0." + Date.now()),
      __ENVIRONMENT__: JSON.stringify(environment),
      __DEV_SERVER__: JSON.stringify(env.DEV_SERVER),
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../public", "index.html"),
      favicon: path.resolve(__dirname, "../public", "favicon.ico"),
    }),
  ];

  if (environment !== "production") {
    plugins.push(new BundleAnalyzerPlugin());
  }

  if (environment === "production") {
    compressionOpts = {
      compressionOptions: {
        numiterations: 15,
      },
      algorithm(input, compressionOptions, callback) {
        return zopfli.gzip(input, compressionOptions, callback);
      },
    };
    const compressionPlugin = new CompressionWebpackPlugin();
    console.log("*** Adding compressionPlugin");
    plugins.push(compressionPlugin);
  }

  const config = {
    mode: environment,
    entry: {
      mainEntry: "./src/index.js",
    },
    resolve: {
      fallback: { crypto: false },
      alias: {
        // Support React Native Web

        // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/

        "react-dom$": "react-dom/profiling",

        "scheduler/tracing": "scheduler/tracing-profiling",
      },
    },
    module: {
      rules: [
        {
          test: /\.js$|jsx/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: "babel-loader",
          },
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    devServer: {
      historyApiFallback: true,
      contentBase: path.resolve(__dirname, "../build"),
      open: true,
      compress: true,
      hot: true,
      port: 8080,
      proxy: { "/api": "http://localhost:5000" },
      // publicPath: "https://cie-assets.nyc3.cdn.digitaloceanspaces.com/",
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
      path: path.resolve(__dirname, "../build"),
      filename: (pathData) => {
        return "[name].[contenthash:8].js";
      },
      chunkFilename: "[name].[contenthash:8].chunk.js",
      // publicPath: "https://cie-assets.nyc3.cdn.digitaloceanspaces.com/",
      publicPath: "/"
    },
    plugins: plugins,
  };
  if (environment !== "production") {
    config["devtool"] = "eval-source-map";
  } else {
    console.log("*** Adding minification")
    config.optimization["minimizer"] = [
      () => ({
        terserOptions: {
          mangle: true,
        },
      }),
    ];
  }
  return config;
};
