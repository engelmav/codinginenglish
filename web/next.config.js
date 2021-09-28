const withLinaria = require('next-linaria');

const isProd = process.env.NODE_ENV === "production";
module.exports = (phase, { defaultConfig }) => {
  const customConfig = {
    // assetPrefix: isProd ? "https://devsite-19e8e.kxcdn.com" : "",
    productionBrowserSourceMaps: true,
    i18n: {
      locales: ["en", "es", "ca-ES"],
      defaultLocale: "en",
    },
    env: {
      ENVIRONMENT: process.env.NODE_ENV,
    },
    // images: {
    //   domains: ["cie-assets.nyc3.cdn.digitaloceanspaces.com"],
    //   deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    //   imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // },
    webpack: (config, options) => {
      config.plugins = config.plugins || [];
      const definePlugin = new options.webpack.DefinePlugin({
        __VERSION__: JSON.stringify("1.0.0." + Date.now()),
        __ENVIRONMENT__: JSON.stringify(process.env.ENVIRONMENT),
        // we can inject axios local (for server-side)
        // and axios remote (/) for client-side based on
        // options.isServer.
        DEV_SERVER: !isProd,
        SERVER_MODE: options.isServer,
      });
      if (!isProd) {
        config.optimization.minimize = false;
      }
      config.plugins.push(definePlugin);
      config.module.rules.push({
        test: /\.js$/,
        use: ["@compiled/webpack-loader"],
      });
      return config;
    },
  };
  return withLinaria(Object.assign(defaultConfig, customConfig));
};
