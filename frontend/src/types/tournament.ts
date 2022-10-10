export enum TournamentStatus {
    Initial = 'initial',
    Ongoing = 'ongoing',
    Finished = 'finished',
}

export interface Tournament {
    id: number
    name: string
    status: TournamentStatus
    competitionId: number
    config: any
    code: string
}
