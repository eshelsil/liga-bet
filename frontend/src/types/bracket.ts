import { WinnerSide } from './match'

// Contract D/H — knockout round identifiers, as served by the backend
// (`GameSubTypes` values). Distinct from the FE display enum `KnockoutStage`;
// map between them with `subTypeToKnockoutStage` (utils/bracket).
export enum GameSubType {
    Last32 = 'LAST_32',
    Last16 = 'LAST_16',
    QuarterFinals = 'QUARTER_FINALS',
    SemiFinals = 'SEMI_FINALS',
    Final = 'FINAL',
    ThirdPlace = 'THIRD_PLACE',
}

// Contract C — a team's bracket half. Semantic structure (the two halves that
// meet only in the final), NOT a text/reading direction. Never flipped by RTL.
export type BracketSide = 'left' | 'right'

export interface BracketTeam {
    id: number
    name: string
    crest_url: string
}

// One participant slot of a tie. Either a resolved team, or — for unsettled
// first-round slots — a source token ("1E", "2B", "3·ABCDF"). Later-round slots
// carry neither (blank boxes on the road to the final).
export interface BracketSlotInfo {
    team: BracketTeam | null
    label: string | null // raw backend token; the FE builds its own label from group_name + position
    is_third_place: boolean // true → clicking it explains how 3rd-place qualification works
    group_id: number | null // concrete source group → clicking opens its standings dialog
    group_name: string | null // e.g. "Group A" — its last token is the group letter ("A")
    position: number | null // group-stage rank this slot resolves from (1 / 2 / 3)
}

// Contract D — one knockout tie as served by GET /api/tournaments/{id}/bracket.
// The endpoint returns a FLAT array of these; the FE groups them by round + side.
export interface BracketGame {
    id: number | null // playable game id — null until the tie is scheduled
    bracket_game_id: number // stable node id (present pre-draw) — use as the React key / identity
    round: GameSubType
    side: BracketSide | null
    match_label: string | null // e.g. "Match 74"
    start_time: number | null

    // Winner/Runner-Up bracket selector — slot objects (team or source token)
    home_slot: BracketSlotInfo
    away_slot: BracketSlotInfo

    // Per-game qualifier bet views — flat team/result fields (home_team === home_slot.team)
    home_team: BracketTeam | null
    away_team: BracketTeam | null
    bettable: boolean
    locked: boolean
    user_qualifier_side: WinnerSide | null
    actual_qualifier_side: WinnerSide | null
    is_done: boolean
}

// Contract B — the slice of competition bracket config the FE renders from.
export interface BracketConfig {
    enabled: boolean
    rounds: GameSubType[] // ordered first → last
    thirdPlace: boolean
}

// The full payload the FE consumes to render the bracket (mock now, real later).
export interface BracketData {
    config: BracketConfig
    games: BracketGame[]
}

// Contract E/G — Winner & Runner-Up special picks rendered on the bracket.
// Why a pick was removed server-side (lazy validation, KNOCKOUT_BRACKET_PLAN §4).
export type BracketRemovalReason = 'wrong_side' | 'not_qualified'

export interface BracketSpecialPick {
    betId: number | null // the SpecialBet id resolved by type (contract G); null until known
    teamId: number | null // the user's current answer
    removedReason: BracketRemovalReason | null // set → the pick was cleared server-side
}

export interface BracketSpecialBets {
    winner: BracketSpecialPick
    runnerUp: BracketSpecialPick
    locked: boolean // tournament started → W/RU read-only
}

// Contract F — per-round bracket scoring (keyed by GameSubType).
export type BracketRoundScores = Partial<Record<GameSubType, number>>
export interface BracketScoreConfig {
    qualifier: BracketRoundScores // per-round points for a correct qualifier pick
    result: BracketRoundScores // per-round perfect-score bonus for nailing the exact result (incl. 3rd place)
    specialAdvance: BracketRoundScores // per-round points when your W/RU qualifies (no 3rd place)
}
