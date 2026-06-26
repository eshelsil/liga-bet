import i18n from '../i18n/config'
import { CompetitionStageName, GameStage, KnockoutStage, Match } from '../types'
import { getGroupName } from './groups'

export function getStageName(stage: GameStage) {
    return i18n.t(`domain:stages.${stage}`, { defaultValue: stage })
}

export function getCompetitionStageName(stage: CompetitionStageName) {
    return i18n.t(`domain:competitionStages.${stage}`, { defaultValue: stage })
}

export function getGameStage(game: Match) {
    if (game.is_knockout) {
        return getStageName(game.subType as KnockoutStage)
    }
    const groupName = game.group?.name
    return groupName ? getGroupName(groupName) : ''
}

// Back-compat aliases (now language-aware, not Hebrew-only).
export const getHebStageName = getStageName
export const getHebCompetitionStageName = getCompetitionStageName
export const getHebGameStage = getGameStage
