import { CongratsAnimationLang } from '../../types'

// Congrats content (title/msg) is admin-authored per tournament and comes from the
// tournament config. The tournament's `lang` only drives text direction/design and the
// few fixed in-animation button labels below (not admin-editable).

const CONGRATS_LABELS: Record<CongratsAnimationLang, { claimPrize: string; closeDiploma: string }> = {
    he: { claimPrize: 'אחלה 👍', closeDiploma: 'אחלה 👍' },
    en: { claimPrize: 'Nice 👍', closeDiploma: 'Nice 👍' },
}

const REPLAY_BUTTON_LABELS: Record<CongratsAnimationLang, string> = {
    he: 'צפייה בסיכום הטורניר 🎉',
    en: 'View tournament summary 🎉',
}

export function getCongratsLabels(lang: CongratsAnimationLang = 'he') {
    return CONGRATS_LABELS[lang] ?? CONGRATS_LABELS.he
}

export function getReplayButtonLabel(lang: CongratsAnimationLang = 'he') {
    return REPLAY_BUTTON_LABELS[lang] ?? REPLAY_BUTTON_LABELS.he
}
