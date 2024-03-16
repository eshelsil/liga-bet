import { Dayjs } from 'dayjs'

export enum CompetitionType {
    WorldCup = 'WC',
    ChampionsLeague = 'UCL',
}

export interface CompetitionConfig {
    type?: CompetitionType
    update_upcoming_games_start_time?: boolean
}

export interface Competition {
    id: number
    name: string
    status: CompetitionStatus
    type: number
    startTime: Dayjs
    lastRegistration: Dayjs
    config?: CompetitionConfig
    emblem?: string
}

export type CompetitionsById = Record<number, Competition>

export enum CompetitionStatus {
    Initial = 'initial',
    Ongoing = 'ongoing',
    Done = 'done',
}