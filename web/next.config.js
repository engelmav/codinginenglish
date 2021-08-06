module.exports = (phase, { defaultConfig }) => {
  const customConfig = {
    env: {
      ENVIRONMENT: process.env.NODE_ENV,
    },
    webpack: (config, options) => {
      config.plugins = config.plugins || [];
      const definePlugin = new options.webpack.DefinePlugin({
        // we can inject axios local (for server-side)
        // and axios remote (/) for client-side based on
        // options.isServer. ugh
        __VERSION__: JSON.stringify("1.0.0." + Date.now()),
        __ENVIRONMENT__: JSON.stringify(process.env.ENVIRONMENT),
        DEV_SERVER: true,
        SERVER_MODE: options.isServer,
      });
      if (process.env.NODE_ENV !== "production") {
        config.optimization.minimize = false;
      }
      config.plugins.push(definePlugin);
      return config;
    },
    async rewrites() {
      return [
        {
          source: "/about",
          destination: "/",
        },
      ];
    },
  };
  return Object.assign(defaultConfig, customConfig);
};
