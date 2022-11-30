import { map, orderBy } from 'lodash'
import { MatchApiModel } from '../types'
import { valuesOf } from './common'

interface TeamRow {
    id: number
    points: number
    goalsFor: number
    goalsAgainst: number
}

interface GroupTableRow extends TeamRow {
    rank: number
}

type EqualTeams = number[]


function compareTeamRows(teamA: TeamRow, teamB: TeamRow){
    const pointsA = teamA.points
    const pointsB = teamB.points
    if (pointsB != pointsA) {
        return (pointsA > pointsB) ? -1 : 1
    }
    const gfA = teamA.goalsFor
    const gaA = teamA.goalsAgainst
    const goalsDiffA = gfA - gaA
    const gfB = teamB.goalsFor
    const gaB = teamB.goalsAgainst
    const goalsDiffB = gfB - gaB
    if (goalsDiffA != goalsDiffB){
        return (goalsDiffA > goalsDiffB) ? -1 : 1
    }
    if (gfA != gfB){
        return (gfA > gfB) ? -1 : 1
    }
    return 0
}

function calculateTeamRows(games: MatchApiModel[]){
    const table: Record<number, TeamRow> = {}
    for (const game of games){
        const {home_team: homeTeamId, away_team: awayTeamId, result_away, result_home} = game
        for (const teamId of [homeTeamId, awayTeamId]) {
            if (!table[teamId]){
                table[teamId] = {
                    id: teamId,
                    points: 0,
                    goalsAgainst: 0,
                    goalsFor: 0,
                }
            }
        }
        table[homeTeamId].goalsFor += result_home
        table[homeTeamId].goalsAgainst += result_away
        table[awayTeamId].goalsFor += result_away
        table[awayTeamId].goalsAgainst += result_home
        if (result_home > result_away){
            table[homeTeamId].points += 3
        } else if (result_home < result_away){
            table[awayTeamId].points += 3
        } else{
            table[homeTeamId].points += 1
            table[awayTeamId].points += 1
        }
    }
    return table
}



function calculateTable(games: MatchApiModel[], relevantTeams?: number[]){
    const relevantGames = relevantTeams ? games.filter(
        game => relevantTeams.includes(game.home_team)
                && relevantTeams.includes(game.away_team) 
    ) : games;
    const tableRowsById = calculateTeamRows(relevantGames)
    const table = valuesOf(tableRowsById).sort(compareTeamRows).map(
        (row, index): GroupTableRow => ({...row, rank: index + 1})
    )
    const equalTeamsSlices: EqualTeams[] = []
    for (const i in table){
        const indexA = Number(i)
        const indexB = indexA + 1
        if (indexB >= table.length){
            break;
        }
        const teamA = table[indexA]
        const teamB = table[indexB]
        if (compareTeamRows(teamA, teamB) === 0){
            if (equalTeamsSlices.length === 0 || !equalTeamsSlices.at(-1).includes(teamA.id)) {
                equalTeamsSlices.push([teamA.id, teamB.id])
            } else {
                equalTeamsSlices.at(-1).push(teamB.id)
            }
        }
    }

    if (equalTeamsSlices.length > 0){
        for (const equalTeams of equalTeamsSlices){
            if (equalTeams.length === relevantTeams?.length ?? 4){
                for (const tableRow of table){
                    tableRow.rank = 1
                }
            } else {
                const baseRank = table.find(row => row.id === equalTeams[0]).rank
                const innerTable = calculateTable(relevantGames, equalTeams);
                for (const innerRow of innerTable){
                    const outerRow = table.find(row => row.id == innerRow.id)
                    outerRow.rank = baseRank - 1 + innerRow.rank
                }
            }
        }
    }

    const finalTable = orderBy(table, 'rank')
    return finalTable
}

export function calculateLiveStandings(games: MatchApiModel[]){
    const table = calculateTable(games)
    return map(table, 'id')
}