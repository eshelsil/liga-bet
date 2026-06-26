import { useTranslation } from 'react-i18next'
import { AppLanguage, storeLanguage } from './direction'

export function useLanguage() {
    const { i18n } = useTranslation()

    const language = i18n.language as AppLanguage

    const changeLanguage = (lng: AppLanguage) => {
        if (lng === language) return
        storeLanguage(lng)
        i18n.changeLanguage(lng)
    }

    return { language, changeLanguage }
}
