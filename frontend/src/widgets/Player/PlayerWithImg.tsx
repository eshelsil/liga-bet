import React from 'react'
import { PlayerWithImgProps } from './types'
import PlayerImg from './PlayerImg'
import './PlayerWithImg.scss'



function PlayerWithImg({
    player,
    classes,
    size = 32,
}: PlayerWithImgProps) {
    return (
        <div className={`LB-PlayerWithImg ${classes?.root ?? ''}`}>
            <PlayerImg player={player} size={size} />
            <div
                className={`PlayerWithImg-name ${classes?.name ?? ''}`}
            >
                {player.name}
            </div>
        </div>
    )
}

export default PlayerWithImg
