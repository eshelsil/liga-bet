import React from 'react'
import { Team } from '../types'
import TeamWithFlag from '../widgets/TeamFlag/TeamWithFlag'
import DragHandleRoundedIcon from '@mui/icons-material/DragHandleRounded';


interface Props extends Team {
    isDisabled?: boolean
}

function TeamStanding({isDisabled, ...team}: Props) {
    const { name } = team
    return (
        <div
            className="LB-TeamStanding"
        >
            <TeamWithFlag name={name} />
            {!isDisabled && (
                <DragHandleRoundedIcon className='dragIcon' />
            )}
        </div>
    )
}

export default TeamStanding
