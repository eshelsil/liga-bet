import { Dayjs } from 'dayjs'


export interface Competition {
    id: number
    name: string
    type: number
    startTime: Dayjs
    lastRegistration: Dayjs
}

export type CompetitionsById = Record<number, Competition>
