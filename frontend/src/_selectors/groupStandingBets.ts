import { groupBy } from 'lodash'
import { createSelector } from 'reselect'
import { GroupWithABet, TournamentStatus } from '../types'
import { TournamentStatusSelector } from './base'
import { CompetitionStartTime, LiveGroupRankBetsWithScoreByGroupId, MyGroupRankBetsById } from './logic'
import { GroupStandingBetsLinked, GroupsWithTeams } from './modelRelations'

export const AllGroupStandingsBets = createSelector(
    GroupStandingBetsLinked,
    GroupsWithTeams,
    LiveGroupRankBetsWithScoreByGroupId, 
    (bets, groups, liveBetsByGroupId) => {
        const betsByGroupId = groupBy(bets, (bet) => bet.relatedGroup.id)
        return {
            liveBetsByGroupId,
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
