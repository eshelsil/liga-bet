import React from 'react'
import { Team } from '../types'
import TeamWithFlag from '../widgets/TeamFlag/TeamWithFlag'
import DragHandleRoundedIcon from '@mui/icons-material/DragHandleRounded';


interface Props extends Team {
    isDisabled?: boolean
}

function TeamStanding({isDisabled, ...team}: Props) {
    return (
        <div
            className="LB-TeamStanding"
        >
            <TeamWithFlag team={team} />
            {!isDisabled && (
                <DragHandleRoundedIcon className='dragIcon' />
            )}
        </div>
    )
}

export default TeamStanding
