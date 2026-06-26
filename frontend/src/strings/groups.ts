import i18n from '../i18n/config'

export function getGroupName(name: string) {
    return i18n.t(`domain:groups.${name.toLowerCase()}`, { defaultValue: name })
}

// Back-compat alias (now language-aware, not Hebrew-only).
export const getHebGroupName = getGroupName
