import { createSelector } from 'reselect'
import { GroupStandingBets, Teams, Contestants, Games } from '../base'
import { mapValues, groupBy, pickBy } from 'lodash'
import { GameType, GroupRankBetWithRelations } from '../../types'
import { GroupsWithTeams } from './groups'
import { calculateLiveStandings, isGameLive, isGameStarted } from '../../utils'

export const GroupStandingBetsWithUserNames = createSelector(
    GroupStandingBets,
    Contestants,
    (bets, users) => {
        return mapValues(bets, (bet) => ({
            ...bet,
            utlName: users[bet.user_tournament_id]?.name,
        }))
    }
)

export const GroupStandingBetsLinked = createSelector(
    GroupStandingBetsWithUserNames,
    GroupsWithTeams,
    Teams,
    (groupRankBets, groups, teams) => {
        const betsWithRelations = mapValues(
            groupRankBets,
            (bet): GroupRankBetWithRelations => ({
                ...bet,
                standings: bet.standings?.map((teamId) => ({
                    ...teams[teamId],
                })),
                relatedGroup: groups[bet.type_id],
            })
        )
        return pickBy(betsWithRelations, (bet) => bet.relatedGroup)
    }
)

export const GroupStandingBetsByGroupId = createSelector(
    GroupStandingBetsLinked,
    (bets) => {
        return groupBy(Object.values(bets), 'type_id')
    }
)

export const GroupStandingBetsByUserId = createSelector(
    GroupStandingBetsLinked,
    (bets) => {
        return groupBy(Object.values(bets), 'user_tournament_id')
    }
)

export const GamesByGroupId = createSelector(
    Games,
    (games) => {
        const groupStageGames = pickBy(games, game => game.type === GameType.GroupStage)
        return groupBy(groupStageGames, game => game.subType)
    }
)

export const LiveGroupStandings = createSelector(
    GamesByGroupId,
    (gamesByGroupId) => {
        const gamesByLiveGroupId = pickBy(gamesByGroupId,
            games => (
                games.filter(isGameStarted).length === 6
                && !!games.find(isGameLive)
            )
        )
        const liveGroupStandingsById = mapValues(gamesByLiveGroupId, calculateLiveStandings)
        return liveGroupStandingsById
    }
)

export const LiveGroupStandingsWithTeams = createSelector(
    LiveGroupStandings,
    Teams,
    (liveStandingsByGroupId, teams) => {
        const liveStandingsWithTeams = mapValues(
            liveStandingsByGroupId,
            teamIds => teamIds.map(teamId => teams[teamId]) 
        )
        return pickBy(liveStandingsWithTeams, (teams) => !teams.includes(null))
    }
)

export const LiveGroupStandingBets = createSelector(
    GroupStandingBetsLinked,
    LiveGroupStandings,
    (bets, liveGroupStandings) => {
        return pickBy(bets, (bet => !!liveGroupStandings[bet.relatedGroup.id]))
    }
)
