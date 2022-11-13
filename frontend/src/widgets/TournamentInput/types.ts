import { TournamentWithLinkedUtl } from '../../types'

export interface TournamentDisplayProps {
    tournament: TournamentWithLinkedUtl,
    index: number,
}

export interface TournamentInputProps {
    value: number
    onChange: (tournamentId: number) => void
    tournamentsById: Record<number, TournamentWithLinkedUtl>
}