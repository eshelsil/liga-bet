import { Player } from '../../types'

export interface PlayerWithImgProps {
    player: Player
    classes?: {
        name?: string
        root?: string
    }
    size?: number
}

export interface PlayerImgProps {
    player: Player
    size?: number
}