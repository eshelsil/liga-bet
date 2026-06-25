import React, { useEffect, useMemo, useState } from 'react'
import ThemeProvider from '@mui/material/styles/ThemeProvider'
import i18n from './config'
import RTL from '../_helpers/RTL'
import { createAppTheme } from '../themes/theme'
import { applyDocumentDirection, getDirection } from './direction'

/**
 * Re-renders the whole MUI/emotion tree whenever the active language changes,
 * so the theme direction, the emotion (RTL/LTR) cache, and the document `dir`
 * attribute all stay in sync. Because this sits near the root and re-renders on
 * `languageChanged`, plain `i18n.t(...)` calls made during render (outside the
 * `useTranslation` hook) also pick up the new language.
 */
export default function LocalizationProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState(i18n.language)

    useEffect(() => {
        const handleChange = (lng: string) => {
            applyDocumentDirection(lng)
            setLanguage(lng)
        }
        i18n.on('languageChanged', handleChange)
        // Ensure the document matches the initial language on mount.
        applyDocumentDirection(i18n.language)
        return () => {
            i18n.off('languageChanged', handleChange)
        }
    }, [])

    const direction = getDirection(language)
    const theme = useMemo(() => createAppTheme(direction), [direction])

    return (
        <ThemeProvider theme={theme}>
            <RTL direction={direction}>{children}</RTL>
        </ThemeProvider>
    )
}
