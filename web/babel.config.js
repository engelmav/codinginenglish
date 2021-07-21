module.exports = function (api) {
  console.log("******************* executing in babel.config.js")
  api.cache(true);
  return {
    presets: [
      "@babel/preset-react",
      [
        "@babel/preset-env",
        {
          targets: {
            esmodules: true,
          },
        },
      ],
    ],
    plugins: [
      "lodash",
      "@babel/plugin-transform-runtime",
      [
        "@babel/plugin-proposal-decorators",
        {
          legacy: true,
        },
      ],
      ["@babel/plugin-proposal-class-properties", { loose: true }],
      ["@babel/plugin-proposal-private-methods", { loose: true }],
    ],
  };
};
// Uncaught Error: Decorating class property failed. Please ensure that proposal-class-properties is enabled and runs after the decorators transform.
