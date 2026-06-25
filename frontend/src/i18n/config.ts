import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, getStoredLanguage } from './direction'

type LocaleModule = { default: Record<string, unknown> }

/**
 * Auto-load every locale file under ./locales/<lng>/<namespace>.json into the
 * i18next resource tree. New namespaces are registered just by dropping a JSON
 * file in the right folder — no central list to maintain.
 */
const localeModules = import.meta.glob<LocaleModule>('./locales/*/*.json', {
    eager: true,
})

const resources: Record<string, Record<string, Record<string, unknown>>> = {}

for (const path in localeModules) {
    // path looks like: ./locales/he/appHeader.json
    const match = path.match(/\.\/locales\/([^/]+)\/([^/]+)\.json$/)
    if (!match) continue
    const [, lng, namespace] = match
    resources[lng] = resources[lng] ?? {}
    resources[lng][namespace] = localeModules[path].default
}

i18n.use(initReactI18next).init({
    resources,
    lng: getStoredLanguage(),
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES,
    defaultNS: 'common',
    fallbackNS: 'common',
    interpolation: {
        escapeValue: false, // React already escapes
    },
    returnNull: false,
})

export default i18n
