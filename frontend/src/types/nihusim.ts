import { MatchBetApiModel } from "./bet"
import { Match } from "./match"
import { UtlBase } from "./utl"

export interface Nihus {
    id: number
    tournament_id: number
    game_id: number
    sender_utl_id: number
    target_utl_id: number
    text: string
    gif: string
    home_score: number
    away_score: number
    seen: boolean
    created_at: boolean
}

export interface NihusWithRelations extends Nihus {
    targetedUtl: UtlBase
    senderUtl: UtlBase
    game: Match
    bet: MatchBetApiModel,
}

export type NihusById = Record<number, Nihus>
export type NihusWithRelationsById = Record<number, NihusWithRelations>