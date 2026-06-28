import { orderBy } from 'lodash'
import { useSelector } from 'react-redux'
import { Team } from '../types'
import { CurrentStandingsTieBreak, GamesByGroupId, GroupsWithTeams, Teams } from '../_selectors'
import { bracketQualifyingInfo, calculateTable, seededTeamIds } from '../utils'
import { StandingsTieBreak } from '../utils/liveGroupStandings'
import { useBracket } from './useBracket'

export interface TeamStanding {
    team: Team
    rank: number
    played: number
    points: number
    goalsFor: number
    goalsAgainst: number
}

export interface GroupStanding {
    id: number
    name: string
    rows: TeamStanding[] // current standing order
}

export interface BracketTeamsData {
    groups: GroupStanding[]
    unseeded: TeamStanding[] // teams not in the bracket, ordered by rank then points
    seeded: Set<number> // teams placed in a bracket slot → qualified
    unqualified: Set<number> // teams currently out of a qualifying position
}

// Current standings per group from FINISHED games only: ranked teams first, then any
// team without a result yet, in draw order.
function groupStanding(
    name: string,
    id: number,
    groupGames,
    groupTeams: Team[],
    tieBreak: StandingsTieBreak,
): GroupStanding {
    const finished = (groupGames ?? []).filter((g) => g.is_done)
    const rows = calculateTable(finished, tieBreak)
    const byId = new Map(rows.map((r) => [r.id, r]))
    const ranked: TeamStanding[] = rows
        .map((r) => {
            const team = groupTeams.find((t) => t.id === r.id)
            return team
                ? {
                      team,
                      rank: r.rank,
                      played: r.played,
                      points: r.points,
                      goalsFor: r.goalsFor,
                      goalsAgainst: r.goalsAgainst,
                  }
                : null
        })
        .filter(Boolean) as TeamStanding[]
    const unplayed: TeamStanding[] = groupTeams
        .filter((t) => !byId.has(t.id))
        .map((team, i) => ({
            team,
            rank: ranked.length + i + 1,
            played: 0,
            points: 0,
            goalsFor: 0,
            goalsAgainst: 0,
        }))
    return { id, name, rows: [...ranked, ...unplayed] }
}

/**
 * Group standings + team-qualification sets for the bracket Winner/Runner-Up flow.
 * Standings are current (finished games), driving the groups grid, the standings dialog,
 * and the finalist picker (which excludes currently-unqualified teams).
 */
export function useBracketTeams(): BracketTeamsData {
    const gamesByGroupId = useSelector(GamesByGroupId)
    const groupsWithTeams = useSelector(GroupsWithTeams)
    const tieBreak = useSelector(CurrentStandingsTieBreak)
    const { games } = useBracket()

    const seeded = seededTeamIds(games)

    const groups: GroupStanding[] = orderBy(
        Object.values(groupsWithTeams).map((g) =>
            groupStanding(g.name, g.id, gamesByGroupId[g.id], g.teams ?? [], tieBreak),
        ),
        (g) => g.name,
    )

    // A team is "currently unqualified" once its group has begun and it sits below the
    // positions that feed the bracket (and isn't a viable 3rd place). Seeded teams are
    // already qualified, so never unqualified.
    const { maxPosByGroup, hasThirdPlace } = bracketQualifyingInfo(games)
    const unqualified = new Set<number>()
    for (const group of groups) {
        const started = group.rows.some((r) => r.played > 0)
        if (!started) continue
        const maxQ = maxPosByGroup.get(group.id) ?? 2
        for (const row of group.rows) {
            if (seeded.has(row.team.id)) continue
            const contending = row.rank <= maxQ || (hasThirdPlace && row.rank === 3)
            if (!contending) unqualified.add(row.team.id)
        }
    }

    const meta = new Map<number, TeamStanding>()
    for (const group of groups) {
        for (const row of group.rows) meta.set(row.team.id, row)
    }

    const unseeded: TeamStanding[] = orderBy(
        [...meta.values()].filter((row) => !seeded.has(row.team.id)),
        [(row) => row.rank, (row) => -row.points],
    )

    return { groups, unseeded: [], seeded, unqualified }
}
