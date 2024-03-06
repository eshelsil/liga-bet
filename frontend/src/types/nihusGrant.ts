
export interface NihusGrant {
    id: number
    user_tournament_id: number
    amount: number
    grant_reason: string
    seen: boolean
}

export type NihusGrantById = Record<number, NihusGrant>
