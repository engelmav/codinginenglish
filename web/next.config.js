module.exports = {
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
    });
    config.plugins.push(definePlugin);
    console.log("********************** running webpack function");
    return config;
  },
};
