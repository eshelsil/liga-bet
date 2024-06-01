import { cloneDeep } from 'lodash'
import { GameBetScoreConfig, GameBetType, GameStage, GameType, KnockoutStage, MatchApiModel, MatchBetsScoreConfig, MatchCommonBase, WinnerSide } from '../types'
import { keysOf } from './common'

export function getWinnerSide(homeScore: number, awayScore: number, qualifier?: WinnerSide) {
    if (homeScore > awayScore) {
        return WinnerSide.Home
    }
    if (homeScore < awayScore) {
        return WinnerSide.Away
    }
    return qualifier ? qualifier : null
}

export function getGameDayString(game: MatchCommonBase) {
    return (new Date(game.start_time)).toISOString().split('T')[0]
}

export function isGameStarted(game: MatchCommonBase) {
    return new Date(game.start_time) < new Date()
}

export function isGameLive(game: MatchCommonBase) {
    return isGameStarted(game) && !game.is_done
}

export function isFinalGame(game: MatchCommonBase) {
    return game.subType === KnockoutStage.Final
}

export function isGameSecondLeg(game: MatchCommonBase) {
    return game.isTwoLeggedTie && !game.isFirstLeg
}

export function getGameStage(game: MatchCommonBase): GameStage {
    if (!game.is_knockout) {
        return GameType.GroupStage;
    }
    return game.subType as KnockoutStage;
}

export function getGameScoreConfig(game: MatchCommonBase, scoreConfig: MatchBetsScoreConfig): GameBetScoreConfig{
    if (game.type === GameType.GroupStage){
        return scoreConfig[GameBetType.GroupStage]
    }
    let resScore = cloneDeep(scoreConfig[GameBetType.Knockout]);
    const bonuses = (scoreConfig[GameBetType.Bonus] ?? {})[game.subType as KnockoutStage];
    if (bonuses){
        for (const key of keysOf(bonuses)){
            if (bonuses[key]){
                resScore[key] = resScore[key] + bonuses[key]
            }
        }
    }
    return resScore;

}

export function calcTotalTwoLegsAggregation(game: MatchCommonBase) {
    const {agg_result_home, agg_result_away, full_result_away, full_result_home, result_home, result_away} = game
    if (typeof agg_result_away !== 'number' || typeof agg_result_home !== 'number') {
        return;
    }
    const extraTimeHome = (typeof full_result_home !== 'number') ? 0 : full_result_home - result_home;
    const extraTimeAway = (typeof full_result_away !== 'number') ? 0 : full_result_away - result_away;
    return {
        [WinnerSide.Home]: agg_result_home + extraTimeHome,
        [WinnerSide.Away]: agg_result_away + extraTimeAway,
    }
}

export function isTeamParticipate(game: MatchApiModel, teamId: number) {
    return game.away_team === teamId || game.home_team === teamId
}

export function getQualifierSide(game: MatchCommonBase) {
    const {is_done, is_knockout, winner_side, result_away, result_home, full_result_home, full_result_away, isTwoLeggedTie} = game
    if (!is_knockout){
        return null
    }
    if (isTwoLeggedTie){
        return getTwoLeggedTieQualifierSide(game);
    }
    if (is_done) {
        return winner_side 
    }
    const regularTimeWinner = getWinnerSide(result_home, result_away)
    if (regularTimeWinner) {
        return regularTimeWinner
    }
    if (typeof result_home === 'number' && typeof result_away === 'number'){
        const fullTimeWinner = getWinnerSide(full_result_home, full_result_away)
        if (fullTimeWinner) {
            return fullTimeWinner
        }
    }
    return winner_side
}

export function getTwoLeggedTieQualifierSide(game: MatchCommonBase) {
    const {is_done, is_knockout, winner_side, result_away, result_home, full_result_home, full_result_away, agg_result_away, agg_result_home, isTwoLeggedTie} = game
    if (!is_knockout){
        return null
    }
    if (!isTwoLeggedTie){
        return null
    }
    if (!isGameSecondLeg(game)){
        return null
    }
    if (is_done) {
        return winner_side 
    }
    const regularTimeWinner = getWinnerSide(agg_result_home, agg_result_away)
    if (regularTimeWinner) {
        return regularTimeWinner
    }
    if (typeof full_result_home === 'number' && typeof full_result_away === 'number'){
        const extraTimeHome = full_result_home - result_home;
        const extraTimeAway = full_result_away - result_away;
        const fullTimeWinner = getWinnerSide(extraTimeHome, extraTimeAway)
        if (fullTimeWinner) {
            return fullTimeWinner
        }
    }
    return null
}

