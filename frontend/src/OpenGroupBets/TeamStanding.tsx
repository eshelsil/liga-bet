import React from 'react'
import { Team } from '../types'
import TeamWithFlag from '../widgets/TeamFlag/TeamWithFlag'
import DragHandleRoundedIcon from '@mui/icons-material/DragHandleRounded';
import { cn } from '@/utils';


export interface TeamStandingProps extends Team {
    index: number
    isDisabled?: boolean
    classes?: Record<number, string>
}

function TeamStanding({isDisabled, index, classes={}, ...team}: TeamStandingProps) {
    return (
        <div
            className={cn("LB-TeamStanding", classes[index])}
        >
            <TeamWithFlag team={team} />
            {!isDisabled && (
                <DragHandleRoundedIcon className='dragIcon' />
            )}
        </div>
    )
}

export default TeamStanding
