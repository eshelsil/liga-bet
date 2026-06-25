import i18n from '@/i18n/config'

function getOurTournamentKey(position: number): string {
    switch (position) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
            return String(position)
        case 6:
        case 7:
            return '6_7'
        case 8:
        case 9:
            return '8_9'
        case 10:
        case 11:
        case 12:
        case 13:
            return '10_13'
        case 14:
            return '14'
        case 15:
            return '15'
        default:
            return 'default'
    }
}

export function getSummaryMsg(position: number, isOurTournament = false) {
    const group = isOurTournament ? 'ourTournament' : 'general'
    const key = isOurTournament
        ? getOurTournamentKey(position)
        : position === 1
        ? '1'
        : 'default'

    const title = i18n.t(`leaderboard:congrats.${group}.${key}.title`)
    const msg = i18n.t(`leaderboard:congrats.${group}.${key}.msg`)
    return { title, msg }
}
