import React from 'react'
import { PlayerImgProps } from './types'

function PlayerImg({
    player,
    size = 50,
}: PlayerImgProps) {
    return (
        <div className='LB-PlayerImg' style={{width: size, height: size}}>
            <img
                className='playerImage'
                src={player.img}
                loading='lazy'
            />
        </div>
    )
}

export default PlayerImg
