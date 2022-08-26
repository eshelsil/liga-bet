import { Moment } from "moment";


export interface Competition {
    id: number,
    name: string,
    type: number,
    startTime: Moment,
    lastRegistration: Moment,
}

export type CompetitionsById = Record<number, Competition>