import { GameBetType, KnockoutStage, Tournament, TournamentStatus } from '../types'

export function isTournamentStarted(tournament: Tournament) {
    const statuses = [TournamentStatus.Ongoing, TournamentStatus.Finished]
    return statuses.includes(tournament.status)
}

export const gameStageToString = {
    [GameBetType.GroupStage]: 'שלב בתים',
    [GameBetType.Knockout]: 'נוקאאוט',
    [KnockoutStage.Final]: 'גמר',
    [KnockoutStage.SemiFinal]: 'חצי גמר',
    [KnockoutStage.QuarterFinal]: 'רבע גמר',
    [KnockoutStage.Last16]: 'שמינית גמר',
}