import React, { useState } from 'react'
import { Button, IconButton } from '@mui/material'
import { MatchBetWithRelations } from '../types'
import CloseIcon from '@mui/icons-material/CloseRounded'
import { isEmpty } from 'lodash'



interface Props  {
    bet: MatchBetWithRelations
    onClose: () => void
    onSave?: (...args: any) => Promise<void>
}

function EditMatchBetView({
    bet,
    onClose,
    onSave,
}: Props) {

    const [homeScore, setHomeScore] = useState(bet?.result_home ?? '')
    const [awayScore, setAwayScore] = useState(bet?.result_away ?? '')
    const hasBet = !isEmpty(bet)

    
    const homeScoreChange = (e: any) => {
        const value = parseInt(e.target.value)
        const score = isNaN(value) ? '' : value
        setHomeScore(score >= 0 ? score : 0)
    }
    const awayScoreChange = (e: any) => {
        const value = parseInt(e.target.value)
        const score = isNaN(value) ? '' : value
        setAwayScore(score >= 0 ? score : 0)
    }

    const saveBet = () => {
        onSave({
            homeScore,
            awayScore,
        })
    }


    // const hasBet = bet?.id !== undefined
    // let winnerSide: WinnerSide
    // if (hasBet && is_knockout) {
    //     if (bet.result_home > bet.result_away) {
    //         winnerSide = WinnerSide.Home
    //     } else if (bet.result_home < bet.result_away) {
    //         winnerSide = WinnerSide.Away
    //     } else {
    //         winnerSide = bet.winner_side
    //     }
    // }
    // const isHomeKoWinner = winnerSide === WinnerSide.Home
    // const isAwayKoWinner = winnerSide === WinnerSide.Away

    return (
        <div className='LB-EditMatchBetView'>
            <div className='inputsRow'>
                <div className='scoreDisplayContainer'>
                    <input
                        onChange={homeScoreChange}
                        className={`form-control open-match-input`}
                        type="tel"
                        value={homeScore}
                    />
                </div>
                <div>
                    -
                </div>
                <div className='scoreDisplayContainer'>
                    <input
                        onChange={awayScoreChange}
                        className={`form-control open-match-input`}
                        type="tel"
                        value={awayScore}
                    />
                </div>
            </div>
            <div className='buttonContainer'>
                <div className='buttonsWrapper'>
                    <Button
                        className='sendButton'
                        variant='contained'
                        color='primary'
                        onClick={saveBet}
                    >
                        שלח
                    </Button>
                    {hasBet && (
                        <IconButton className={'closeIcon'} onClick={onClose}>
                            <CloseIcon />
                        </IconButton>
                    )}
                </div>
            </div>
        </div>
    )
}

export default EditMatchBetView
