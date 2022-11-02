import React from 'react'
import { IconButton } from '@mui/material'
import { MatchBetWithRelations, WinnerSide } from '../types'
import EditIcon from '@mui/icons-material/Edit';



function CurrentBetView({
    bet,
    onEdit,
}: {
    bet: MatchBetWithRelations
    onEdit: (opener?: WinnerSide) => void
}) {
    const { result_home: homeScore, result_away: awayScore} = bet

    const clickOnHomeScore = () => onEdit(WinnerSide.Home)
    const clickOnAwayScore = () => onEdit(WinnerSide.Away)
    const clickOnEditIcon = () => onEdit()


    return (
        <div className='LB-CurrentBetView'>
            <div className='inputsRow'>
                <div className='scoreDisplayContainer'>
                    <div className='scoreDisplay' onClick={clickOnHomeScore}>
                        <div className='scoreText'>
                            {homeScore}
                        </div>
                    </div>
                </div>
                <div>
                    -
                </div>
                <div className='scoreDisplayContainer'>
                    <div className='scoreDisplay' onClick={clickOnAwayScore}>
                        <div className='scoreText'>
                            {awayScore}
                        </div>
                    </div>
                </div>
            </div>
            <div className='buttonContainer'>
                <IconButton onClick={clickOnEditIcon}>
                    <EditIcon />
                </IconButton>
            </div>
        </div>
    )
}

export default CurrentBetView
