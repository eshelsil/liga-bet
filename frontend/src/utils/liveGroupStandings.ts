import { MatchApiModel } from '../types'
import { valuesOf } from './common'

// Group tie-break order. Differs by competition:
//  - 'goalDiffFirst'  : points → goal diff → goals for → head-to-head (default).
//  - 'headToHeadFirst': points → head-to-head → goal diff → goals for (e.g. World Cup,
//    where games between the tied teams outrank overall goal difference).
export type StandingsTieBreak = 'goalDiffFirst' | 'headToHeadFirst'

interface TeamRow {
    id: number
    played: number
    points: number
    goalsFor: number
    goalsAgainst: number
}

interface GroupTableRow extends TeamRow {
    rank: number
}

const goalDiff = (r: TeamRow) => r.goalsFor - r.goalsAgainst

function calculateTeamRows(games: MatchApiModel[]): Record<number, TeamRow> {
    const table: Record<number, TeamRow> = {}
    for (const game of games) {
        const { home_team: homeTeamId, away_team: awayTeamId, result_away, result_home } = game
        for (const teamId of [homeTeamId, awayTeamId]) {
            if (!table[teamId]) {
                table[teamId] = { id: teamId, played: 0, points: 0, goalsAgainst: 0, goalsFor: 0 }
            }
        }
        table[homeTeamId].played += 1
        table[awayTeamId].played += 1
        table[homeTeamId].goalsFor += result_home
        table[homeTeamId].goalsAgainst += result_away
        table[awayTeamId].goalsFor += result_away
        table[awayTeamId].goalsAgainst += result_home
        if (result_home > result_away) {
            table[homeTeamId].points += 3
        } else if (result_home < result_away) {
            table[awayTeamId].points += 3
        } else {
            table[homeTeamId].points += 1
            table[awayTeamId].points += 1
        }
    }
    return table
}

// Split ids into ranked tie-buckets: consecutive ids equal under `eq` share a bucket.
function bucketBy(
    ids: number[],
    cmp: (a: number, b: number) => number,
    eq: (a: number, b: number) => boolean,
): number[][] {
    const sorted = [...ids].sort(cmp)
    const buckets: number[][] = []
    for (const id of sorted) {
        const last = buckets[buckets.length - 1]
        if (last && eq(last[0], id)) last.push(id)
        else buckets.push([id])
    }
    return buckets
}

export function calculateTable(
    games: MatchApiModel[],
    tieBreak: StandingsTieBreak = 'goalDiffFirst',
): GroupTableRow[] {
    const rowsById = calculateTeamRows(games)
    const allIds = valuesOf(rowsById).map((r) => r.id)

    // A tie-break by a single overall metric (points / goal diff / goals for).
    const numericStep = (key: (r: TeamRow) => number) => (ids: number[]) =>
        bucketBy(
            ids,
            (a, b) => key(rowsById[b]) - key(rowsById[a]),
            (a, b) => key(rowsById[a]) === key(rowsById[b]),
        )

    // Head-to-head: a mini-league over only the games among the tied teams.
    const headToHeadStep = (ids: number[]) => {
        const inner = calculateTeamRows(
            games.filter((g) => ids.includes(g.home_team) && ids.includes(g.away_team)),
        )
        const get = (id: number) => inner[id] ?? { id, played: 0, points: 0, goalsFor: 0, goalsAgainst: 0 }
        const cmp = (a: number, b: number) =>
            get(b).points - get(a).points ||
            goalDiff(get(b)) - goalDiff(get(a)) ||
            get(b).goalsFor - get(a).goalsFor
        const eq = (a: number, b: number) =>
            get(a).points === get(b).points &&
            goalDiff(get(a)) === goalDiff(get(b)) &&
            get(a).goalsFor === get(b).goalsFor
        return bucketBy(ids, cmp, eq)
    }

    const pointsStep = numericStep((r) => r.points)
    const gdStep = numericStep(goalDiff)
    const gfStep = numericStep((r) => r.goalsFor)

    const steps =
        tieBreak === 'headToHeadFirst'
            ? [pointsStep, headToHeadStep, gdStep, gfStep]
            : [pointsStep, gdStep, gfStep, headToHeadStep]

    // Recursively split each tied bucket by the next tie-breaker.
    const rankBuckets = (ids: number[], stepIdx: number): number[][] => {
        if (ids.length <= 1 || stepIdx >= steps.length) return [ids]
        return steps[stepIdx](ids).flatMap((bucket) =>
            bucket.length > 1 ? rankBuckets(bucket, stepIdx + 1) : [bucket],
        )
    }

    const table: GroupTableRow[] = []
    let rank = 1
    for (const bucket of rankBuckets(allIds, 0)) {
        for (const id of bucket) table.push({ ...rowsById[id], rank })
        rank += bucket.length // teams in the same tie-bucket share a rank
    }
    return table
}

export function calculateLiveStandings(
    games: MatchApiModel[],
    tieBreak: StandingsTieBreak = 'goalDiffFirst',
) {
    return calculateTable(games, tieBreak).map((row) => row.id)
}
