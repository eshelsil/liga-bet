export type AppLanguage = 'he' | 'en'
export type Direction = 'rtl' | 'ltr'

export const DEFAULT_LANGUAGE: AppLanguage = 'he'
export const SUPPORTED_LANGUAGES: AppLanguage[] = ['he', 'en']
export const LANGUAGE_STORAGE_KEY = 'ligaBetLang'
// Shared (plaintext, non-httpOnly) cookie set by the pre-login PHP pages.
// Keeping the same name on both sides lets the language carry across.
export const LANGUAGE_COOKIE_KEY = 'locale'
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365 // 1 year

const RTL_LANGUAGES: AppLanguage[] = ['he']

export function getDirection(lng: string): Direction {
    return RTL_LANGUAGES.includes(lng as AppLanguage) ? 'rtl' : 'ltr'
}

function isSupported(lng: string | null | undefined): lng is AppLanguage {
    return !!lng && SUPPORTED_LANGUAGES.includes(lng as AppLanguage)
}

function readLocaleCookie(): AppLanguage | null {
    try {
        const match = document.cookie.match(
            new RegExp('(?:^|; )' + LANGUAGE_COOKIE_KEY + '=([^;]*)')
        )
        const value = match ? decodeURIComponent(match[1]) : null
        return isSupported(value) ? value : null
    } catch {
        return null
    }
}

/**
 * Resolve the initial language. The locale chosen on the pre-login PHP pages is
 * stored in a shared `locale` cookie, so it takes priority and carries over to
 * the app. Falls back to the in-app choice (localStorage), then the default.
 */
export function getStoredLanguage(): AppLanguage {
    const fromCookie = readLocaleCookie()
    if (fromCookie) {
        return fromCookie
    }
    try {
        const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY)
        if (isSupported(stored)) {
            return stored
        }
    } catch {
        // localStorage may be unavailable (private mode); fall back to default
    }
    return DEFAULT_LANGUAGE
}

export function storeLanguage(lng: AppLanguage): void {
    try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, lng)
    } catch {
        // ignore persistence failures
    }
    // Write the same shared cookie so the choice propagates back to the PHP
    // (pre-login) pages too. Plaintext + path=/ to match the backend.
    try {
        document.cookie =
            `${LANGUAGE_COOKIE_KEY}=${lng}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; samesite=lax`
    } catch {
        // ignore cookie write failures
    }
}

/**
 * Sync the document's direction/lang attributes with the active language.
 * Called on init (before render) and on every language change.
 */
export function applyDocumentDirection(lng: string): void {
    const dir = getDirection(lng)
    if (typeof document !== 'undefined') {
        document.documentElement.dir = dir
        document.documentElement.lang = lng
        if (document.body) {
            document.body.dir = dir
        }
    }
}
