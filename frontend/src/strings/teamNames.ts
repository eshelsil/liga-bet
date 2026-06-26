import i18n from '../i18n/config'

export function getTeamName(name: string) {
    return i18n.t(`domain:teams.${name.toLowerCase()}`, { defaultValue: name })
}

// Back-compat alias (now language-aware, not Hebrew-only).
export const getHebTeamName = getTeamName
