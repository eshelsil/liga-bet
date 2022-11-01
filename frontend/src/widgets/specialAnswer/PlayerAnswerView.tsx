import React from 'react'
import { Player } from '../../types'
import { BigPlayerWithImg } from '../Player'

function PlayerAnswerView({ player }: { player: Player }) {
    return <BigPlayerWithImg player={player} />
}

export default PlayerAnswerView
