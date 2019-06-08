import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

function loadLocaleMessages () {
  const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  var messages: VueI18n.LocaleMessages
  messages = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })
  return messages
}

export default new VueI18n({
  locale: navigator.language || process.env.VUE_APP_I18N_LOCALE || 'de-EN',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'de-EN',
  messages: loadLocaleMessages()
})
