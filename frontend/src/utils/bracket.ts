import dayjs from 'dayjs'
import { BracketConfig, BracketGame, BracketSide, GameSubType, KnockoutStage, Team, Tournament, TournamentType } from '../types'
import { BracketSlotInfo, BracketTeam } from '../types/bracket'

// Canonical round order (enum declaration order): R32 → … → Final → 3rd place.
const ROUND_ORDER = Object.values(GameSubType) as GameSubType[]

// Contract A. Absent/undefined type === classic (back-compat).
export function isKnockoutBracket(tournament?: Tournament): boolean {
    return tournament?.type === TournamentType.KnockoutBracket
}

// Map backend round ids (GameSubTypes / contract D) → the FE display enum, so we
// reuse the existing localized stage names in strings/stages.ts.
const SUB_TYPE_TO_STAGE: Record<GameSubType, KnockoutStage> = {
    [GameSubType.Last32]: KnockoutStage.Last32,
    [GameSubType.Last16]: KnockoutStage.Last16,
    [GameSubType.QuarterFinals]: KnockoutStage.QuarterFinal,
    [GameSubType.SemiFinals]: KnockoutStage.SemiFinal,
    [GameSubType.Final]: KnockoutStage.Final,
    [GameSubType.ThirdPlace]: KnockoutStage.ThirdPlace,
}

export function subTypeToKnockoutStage(round: GameSubType): KnockoutStage {
    return SUB_TYPE_TO_STAGE[round]
}

// Inverse of SUB_TYPE_TO_STAGE: a playable game's `subType` (KnockoutStage) → the
// bracket round id (GameSubType) used to key `scores.bracket.{qualifier,specialAdvance}`.
const STAGE_TO_SUB_TYPE: Record<KnockoutStage, GameSubType> = {
    [KnockoutStage.Last32]: GameSubType.Last32,
    [KnockoutStage.Last16]: GameSubType.Last16,
    [KnockoutStage.QuarterFinal]: GameSubType.QuarterFinals,
    [KnockoutStage.SemiFinal]: GameSubType.SemiFinals,
    [KnockoutStage.Final]: GameSubType.Final,
    [KnockoutStage.ThirdPlace]: GameSubType.ThirdPlace,
}

export function knockoutStageToSubType(stage: KnockoutStage | number): GameSubType | undefined {
    return STAGE_TO_SUB_TYPE[stage as KnockoutStage]
}

// The slot's source token, built from the API's group + position. "1A" / "2B" — the
// group letter is the last space-separated token of group_name ("Group A" → "A"). Third
// place qualifies from an unknown group, so it shows "3?". Falls back to the raw backend
// label, and null for later-round (blank) slots.
export function bracketSlotLabel(slot: BracketSlotInfo): string | null {
    if (slot.is_third_place) return '3rd'
    if (slot.position != null && slot.group_name) {
        const letter = slot.group_name.split(' ').pop() || slot.group_name
        return `${slot.position}${letter}`
    }
    return slot.label
}

// Which group-stage positions feed the bracket, read from the first-round source tokens:
// the highest `position` referenced per group (e.g. top 2), and whether any third-place
// slot exists (some 3rd places also qualify). Used to flag "currently unqualified" teams.
export function bracketQualifyingInfo(games: BracketGame[]): {
    maxPosByGroup: Map<number, number>
    hasThirdPlace: boolean
} {
    const maxPosByGroup = new Map<number, number>()
    let hasThirdPlace = false
    for (const game of games) {
        for (const slot of [game.home_slot, game.away_slot]) {
            if (slot.is_third_place) hasThirdPlace = true
            if (slot.group_id != null && slot.position != null) {
                maxPosByGroup.set(slot.group_id, Math.max(maxPosByGroup.get(slot.group_id) ?? 0, slot.position))
            }
        }
    }
    return { maxPosByGroup, hasThirdPlace }
}

// A round is the bracket-wide decider (no left/right halves) — rendered centrally.
export function isCentralRound(round: GameSubType): boolean {
    return round === GameSubType.Final || round === GameSubType.ThirdPlace
}

// The /bracket endpoint returns a flat list (no config object); derive the
// structural config (round order first→last, third-place presence) from the ties.
export function deriveBracketConfig(games: BracketGame[]): BracketConfig {
    const present = new Set(games.map((g) => g.round))
    const rounds = ROUND_ORDER.filter(
        (round) => present.has(round) && round !== GameSubType.ThirdPlace,
    )
    return {
        enabled: rounds.length > 0,
        rounds,
        thirdPlace: present.has(GameSubType.ThirdPlace),
    }
}

export function formatBracketKickoff(startTime: number | null): string {
    if (startTime == null) return ''
    return dayjs.unix(startTime).format('DD/MM HH:mm')
}

// Adapt a contract-D BracketTeam to the `Team` shape the shared TeamWithFlag/
// TeamFlag widgets expect. Bracket teams are national sides (is_club=false →
// rendered as a circle flag by name).
export function bracketTeamToTeam(team: BracketTeam): Team {
    return {
        id: team.id,
        external_id: team.id,
        name: team.name,
        crest_url: team.crest_url,
        group_id: '',
        competition_id: 0,
        is_club: false,
    }
}

// Which of the user's bracket special picks (if any) a team holds. Drives the
// 🏆/🥈 indication and the auto-locked qualifier on ties containing a W/RU pick.
export type BracketSpecialRole = 'winner' | 'runnerUp' | null
export function bracketSpecialRole(
    teamId: number | null | undefined,
    winnerTeamId: number | null,
    runnerUpTeamId: number | null,
): BracketSpecialRole {
    if (teamId == null) return null
    if (teamId === winnerTeamId) return 'winner'
    if (teamId === runnerUpTeamId) return 'runnerUp'
    return null
}

// Locate a team (by id) anywhere in the bracket — teams recur across rounds.
export function findBracketTeam(games: BracketGame[], teamId: number | null): BracketTeam | null {
    if (teamId == null) return null
    for (const game of games) {
        if (game.home_slot.team?.id === teamId) return game.home_slot.team
        if (game.away_slot.team?.id === teamId) return game.away_slot.team
    }
    return null
}

// Contract C — a team's bracket side, read from any (non-central) tie it occupies.
// null until determinable (team not yet placed / drawn).
export function getTeamSide(games: BracketGame[], teamId: number | null): BracketSide | null {
    if (teamId == null) return null
    for (const game of games) {
        if (isCentralRound(game.round)) continue
        const inGame = game.home_slot.team?.id === teamId || game.away_slot.team?.id === teamId
        if (inGame && game.side) return game.side
    }
    return null
}

// Team ids already placed in a bracket slot (seeded). Everyone else is "unseeded"
// and offered via the inline picker.
export function seededTeamIds(games: BracketGame[]): Set<number> {
    const ids = new Set<number>()
    for (const game of games) {
        if (game.home_slot.team) ids.add(game.home_slot.team.id)
        if (game.away_slot.team) ids.add(game.away_slot.team.id)
    }
    return ids
}

// Games of one side, in the round order declared by the config (first → last).
export function gamesForSide(
    games: BracketGame[],
    rounds: GameSubType[],
    side: BracketSide,
): BracketGame[] {
    const order = new Map(rounds.map((r, i) => [r, i]))
    return games
        .filter((g) => g.side === side && !isCentralRound(g.round))
        .sort((a, b) => (order.get(a.round) ?? 0) - (order.get(b.round) ?? 0))
}
