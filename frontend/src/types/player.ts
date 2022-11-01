import { Dictionary } from 'lodash'
import { Team } from './teams'

export interface PlayerBaseModel {
    id: number
    name: string
    externalId: number
    number: number
    goalsScored: number
    img: string
}

export interface PlayerApiModel extends PlayerBaseModel {
    team: number
}

export interface Player extends PlayerBaseModel {
    team: Team
}

export type PlayerApiModelById = Dictionary<PlayerApiModel>
export type PlayersById = Dictionary<Player>
