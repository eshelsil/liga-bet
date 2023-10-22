import { createSelector } from 'reselect'
import { valuesOf } from '../../utils'
import { CurrentTournamentNotifications, Notifications} from '../base'
import { MyOtherTournaments } from './tournaments'
import { pick } from 'lodash'

export const MissingQuestionBetsCount = createSelector(
    CurrentTournamentNotifications,
    (notifications) => notifications?.questions?.length ?? 0
)

export const MissingGameBetsCount = createSelector(
    CurrentTournamentNotifications,
    (notifications) => notifications?.games?.length ?? 0
)

export const MissingGroupRankBetsCount = createSelector(
    CurrentTournamentNotifications,
    (notifications) => notifications?.groups?.length ?? 0
)

export const MissingBetsCount = createSelector(
    CurrentTournamentNotifications,
    (notifications) => {
        const {questions = [], games = [], groups = []} = notifications
        return games.length + groups.length + questions.length
    }
)

export const HasNotificationsOnOtherTournaments = createSelector(
    Notifications,
    MyOtherTournaments,
    (notifications, otherTournaments) => {
        const otherTournamentsNotifications = pick(notifications, otherTournaments)
        return !!valuesOf(otherTournamentsNotifications).find(count => count > 0)
    }
)