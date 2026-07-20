import { CongratsAnimationLang } from '../../types'

// Congrats content (title/msg) is admin-authored per tournament and comes from the
// tournament config. The tournament's `lang` only drives text direction/design and the
// few fixed in-animation button labels below (not admin-editable).

const CONGRATS_LABELS: Record<CongratsAnimationLang, { claimPrize: string; closeDiploma: string }> = {
    he: { claimPrize: 'קחו את הפרס 🏆', closeDiploma: 'אחלה 👍' },
    en: { claimPrize: 'Take the prize 🏆', closeDiploma: 'Nice 👍' },
}

export function getCongratsLabels(lang: CongratsAnimationLang = 'he') {
    return CONGRATS_LABELS[lang] ?? CONGRATS_LABELS.he
}
