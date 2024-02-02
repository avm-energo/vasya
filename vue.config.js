module.exports = {
  devServer: {
    allowedHosts: 'all',
  },
  chainWebpack: config => {			
    if (process.env.NODE_ENV === 'production') {			
      config.module.rule('vue').uses.delete('cache-loader');			
      config.module.rule('js').uses.delete('cache-loader');			
      config.module.rule('ts').uses.delete('cache-loader');			
      config.module.rule('tsx').uses.delete('cache-loader');			
    }			
  },
  configureWebpack: config => {
    config.devtool = 'source-map'
  },
  // configureWebpack: {
  //       devServer: {
  //           host: 'mycustomdomain',
  //           port: '8080'
  //       }
  //   }
  // transpileDependencies: ["lodash"]
}
