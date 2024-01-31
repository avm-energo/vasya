module.exports = {
  devServer: {
    allowedHosts: 'all',
    headers: { 'Cache-Control': 'no-store' }
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
    if (process.env.NODE_ENV === 'production') {
      config.optimization.splitChunks.cacheGroups = {
        default: false,
        vendors: false,
        // Создаем новый кэш для статических файлов
        assets: {
          test: /[\\/](js|css|png|jpg)$/,
          name: 'static',
          chunks: 'all',
          priority: 20,
          enforce: true,
        },
      };
      
      config.output.filename = '[name].[contenthash].js'; // Добавляем contenthash к именам файлов
      config.output.chunkFilename = '[name].[contenthash].js'; // Обрабатываем chunk файлы аналогично
    }
  },
  // configureWebpack: {
  //       devServer: {
  //           host: 'mycustomdomain',
  //           port: '8080'
  //       }
  //   }
  // transpileDependencies: ["lodash"]
}
