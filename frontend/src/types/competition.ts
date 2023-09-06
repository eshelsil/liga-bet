import { Dayjs } from 'dayjs'


export interface Competition {
    id: number
    name: string
    status: CompetitionStatus
    type: number
    startTime: Dayjs
    lastRegistration: Dayjs
    emblem?: string
}

export type CompetitionsById = Record<number, Competition>

export enum CompetitionStatus {
    Initial = 'initial',
    Ongoing = 'ongoing',
    Done = 'done',
}