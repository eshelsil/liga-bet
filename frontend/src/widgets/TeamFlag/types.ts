import { Team } from "../../types"

export interface TeamWithFlagProps {
    team: Team
    classes?: {
        name?: string
        root?: string
    }
    crest_url?: string
    is_ko_winner?: boolean
    size?: number
}