import React from 'react'
import { Competition } from '../types'

interface Props {
    competition: Competition
}

function CompetitionTile({ competition }: Props) {

    return (
        <div className="LB-CompetitionTile">
            {competition.emblem && (
                <img className="CompetitionTile-emblem" src={competition.emblem} />
            )}
            <div className='CompetitionTile-name'>
                {competition.name}
            </div>
        </div>
    )
}

export default CompetitionTile