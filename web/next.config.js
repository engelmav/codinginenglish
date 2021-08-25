const isProd = process.env.NODE_ENV === "production";
module.exports = (phase, { defaultConfig }) => {
  const customConfig = {
    // assetPrefix: isProd ? "https://devsite-19e8e.kxcdn.com" : "",
    i18n: {
      locales: ["en", "es", "ca-ES"],
      defaultLocale: "en",
    },
    env: {
      ENVIRONMENT: process.env.NODE_ENV,
    },
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
      return config;
    },
  };
  return Object.assign(defaultConfig, customConfig);
};
