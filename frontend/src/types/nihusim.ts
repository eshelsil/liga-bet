
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
}

export type NihusById = Record<number, Nihus>
