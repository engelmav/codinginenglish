module.exports = {
  webpack: (config, options) => {
    config.plugins = config.plugins || [];
    const definePlugin = new options.webpack.DefinePlugin({
      __VERSION__: JSON.stringify("1.0.0." + Date.now()),
      __ENVIRONMENT__: JSON.stringify(environment),
      DEV_SERVER: true,
      ENVIRONMENT: "development"
    });
    config.module.plugins.push(definePlugin);
    return config;
  },
  env: {
    DEV_SERVER: true,
    ENVIRONMENT: "development"
  },
  publicRuntimeConfig: {
    DEV_SERVER: process.env.DEV_SERVER,
    ENVIRONMENT: "development"
  }
};
