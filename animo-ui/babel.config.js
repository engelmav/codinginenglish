module.exports = function (api) {
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
      [
        "@babel/plugin-proposal-decorators",
        {
          legacy: true,
        },
      ],
      ["@babel/plugin-proposal-class-properties", { loose: true }],
      ["@babel/plugin-proposal-private-methods", { loose: true }],
      "@babel/plugin-transform-runtime",
      ["@babel/plugin-proposal-private-property-in-object", { loose: true }],
    ],
  };
};
