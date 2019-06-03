const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    }
  },
  configureWebpack: {
    plugins: [
      new WorkboxPlugin.GenerateSW()
    ]
  }
}
