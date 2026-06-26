import { createSelector } from 'reselect'
import { valuesOf } from '../../utils'
import { SpecialQuestionType } from '../../types'
import {
    CurrentTournamentNotifications,
    Games,
    IsCurrentTournamentKnockoutBracket,
    Notifications,
    SpecialQuestions,
} from '../base'
import { MyOtherTournaments } from './tournaments'
import { pick } from 'lodash'

// In a knockout-bracket tournament the user only bets on knockout ties + Winner/Runner-Up.
// Group-rank bets, other special questions and group-stage games aren't theirs to bet, so
// they must not light up the menu "missing bets" ping.

export const MissingQuestionBetsCount = createSelector(
    CurrentTournamentNotifications,
    IsCurrentTournamentKnockoutBracket,
    SpecialQuestions,
    (notifications, isBracket, questionsById) => {
        const ids = notifications?.questions ?? []
        if (!isBracket) return ids.length
        return ids.filter((id) => {
            const type = questionsById[id]?.type
            return type === SpecialQuestionType.Winner || type === SpecialQuestionType.RunnerUp
        }).length
    }
)

export const MissingGameBetsCount = createSelector(
    CurrentTournamentNotifications,
    IsCurrentTournamentKnockoutBracket,
    Games,
    (notifications, isBracket, gamesById) => {
        const ids = notifications?.games ?? []
        if (!isBracket) return ids.length
        return ids.filter((id) => gamesById[id]?.is_knockout).length
    }
)

export const MissingGroupRankBetsCount = createSelector(
    CurrentTournamentNotifications,
    IsCurrentTournamentKnockoutBracket,
    (notifications, isBracket) => (isBracket ? 0 : notifications?.groups?.length ?? 0)
)

export const MissingBetsCount = createSelector(
    MissingGameBetsCount,
    MissingGroupRankBetsCount,
    MissingQuestionBetsCount,
    (games, groups, questions) => games + groups + questions
)

export const HasNotificationsOnOtherTournaments = createSelector(
    Notifications,
    MyOtherTournaments,
    (notifications, otherTournaments) => {
        const otherTournamentsNotifications = pick(notifications, otherTournaments)
        return !!valuesOf(otherTournamentsNotifications).find(count => count > 0)
    }
)
