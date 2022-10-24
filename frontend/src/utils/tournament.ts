import { GameBetType, KnockoutStage, Tournament, TournamentStatus } from '../types'

export function isTournamentStarted(tournament: Tournament) {
    return tournament.status !== TournamentStatus.Initial
}

export const gameStageToString = {
    [GameBetType.GroupStage]: 'שלב בתים',
    [GameBetType.Knockout]: 'נוקאאוט',
    [KnockoutStage.Final]: 'גמר',
    [KnockoutStage.SemiFinal]: 'חצי גמר',
    [KnockoutStage.QuarterFinal]: 'רבע גמר',
    [KnockoutStage.Last16]: 'שמינית גמר',
}