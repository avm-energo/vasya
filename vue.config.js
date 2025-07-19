export default {
  devServer: {
    allowedHosts: 'all',
  },

  chainWebpack(config) {
    if (process.env.NODE_ENV === 'production') {
      config.module.rule('vue').uses.delete('cache-loader');
      config.module.rule('js').uses.delete('cache-loader');
      config.module.rule('ts').uses.delete('cache-loader');
      config.module.rule('tsx').uses.delete('cache-loader');
    }

    config.plugin('define').tap((definitions) => {
      definitions[0]['__VUE_PROD_DEVTOOLS__'] = false;
      definitions[0]['__VUE_OPTIONS_API__'] = true;
      definitions[0]['__VUE_PROD_HYDRATION_MISMATCH_DETAILS__'] = false;
      return definitions;
    });
  },

  configureWebpack(config) {
    config.devtool = 'source-map';
  }
};