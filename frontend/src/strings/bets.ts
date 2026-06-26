import { GameBetScoreConfig } from '@/types'
import i18n from '../i18n/config'

export function getBetSliceName(type: keyof GameBetScoreConfig) {
    return i18n.t(`domain:betSlices.${type}`, { defaultValue: type })
}

// Back-compat alias (now language-aware, not Hebrew-only).
export const getHebBetSliceName = getBetSliceName
