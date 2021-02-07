const pluginName = 'ThemePlugin';
class ThemePlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap(
      pluginName,
      compilation => {
        compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tap(
          pluginName,
          (htmlPluginData) => {
            htmlPluginData.html = htmlPluginData.html.replace(
              `<!-- theme css files will be auto injected -->`,
              `
                <link rel="stylesheet" href="theme/light/default.css">     
                <link rel="prefetch" href="theme/dark/default.css">     
              `
            )
          }
        )
      }
    )
  }
}
const plugins = []

if (process.env.VUE_APP_BUILT_MODE === 'prod'){
  plugins.push(new ThemePlugin())
}

module.exports = {
  lintOnSave: false,
  productionSourceMap: process.env.NODE_ENV === 'development',
  css: {
    extract: process.env.NODE_ENV !== 'development',
    // 是否构建样式地图，false 将提高构建速度
    sourceMap: true,
    loaderOptions: {
      scss: {
        // additionalData: `@import "~@/assets/variable.scss";`
      }
    }
  },
  devServer: {
    disableHostCheck: true
  },
  parallel: require('os').cpus().length > 1,
  configureWebpack: {
    //webpack的相关配置在这里
    plugins: plugins
  }
}
