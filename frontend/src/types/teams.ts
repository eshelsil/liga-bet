export interface Team {
    id: number
    external_id: string | number
    name: string
    crest_url: string
    group_id: number | string
    competition_id: number
    is_club: boolean
}

export type TeamsById = Record<number, Team>
