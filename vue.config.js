module.exports = {
  publicPath: "./",
  productionSourceMap: false,
  filenameHashing: false,
  configureWebpack: {
    optimization: {
      splitChunks: false,
    },
  },
  css: {
    extract: false,
  },
};
