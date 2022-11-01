import React from 'react'
import { IconButton } from '@mui/material'
import { MatchBetWithRelations } from '../types'
import EditIcon from '@mui/icons-material/Edit';



function CurrentBetView({
    bet,
    onEdit,
}: {
    bet: MatchBetWithRelations
    onEdit: () => void
}) {
    const { result_home: homeScore, result_away: awayScore} = bet


    return (
        <div className='LB-CurrentBetView'>
            <div className='inputsRow'>
                <div className='scoreDisplayContainer'>
                    <div className='scoreDisplay' onClick={onEdit}>
                        {homeScore}
                    </div>
                </div>
                <div>
                    -
                </div>
                <div className='scoreDisplayContainer'>
                    <div className='scoreDisplay' onClick={onEdit}>
                        {awayScore}
                    </div>
                </div>
            </div>
            <div className='buttonContainer'>
                <IconButton onClick={onEdit}>
                    <EditIcon />
                </IconButton>
            </div>
        </div>
    )
}

export default CurrentBetView
