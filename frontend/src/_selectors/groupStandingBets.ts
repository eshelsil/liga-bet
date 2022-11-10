import { groupBy } from 'lodash'
import { createSelector } from 'reselect'
import { GroupWithABet, TournamentStatus } from '../types'
import { TournamentStatusSelector } from './base'
import { CompetitionStartTime, MyGroupRankBetsById } from './logic'
import { GroupStandingBetsLinked, GroupsWithTeams } from './modelRelations'

export const AllGroupStandingsBets = createSelector(
    GroupStandingBetsLinked,
    GroupsWithTeams,
    (bets, groups) => {
        const betsByGroupId = groupBy(bets, (bet) => bet.relatedGroup.id)
        return {
            betsByGroupId,
            groups: Object.values(groups),
        }
    }
)

export const OpenGroupRankBetsSelector = createSelector(
    GroupsWithTeams,
    MyGroupRankBetsById,
    CompetitionStartTime,
    TournamentStatusSelector,
    (groups, groupBets, competitionStartTime, tournamentStatus) => {
        const groupsWithBet = Object.values(groups).map(
            (group): GroupWithABet => ({
                ...group,
                bet: groupBets[group.id],
            })
        )
        return {
            groupsWithBet,
            competitionStartTime,
            isAvailable: tournamentStatus === TournamentStatus.Initial
        }
    }
)
