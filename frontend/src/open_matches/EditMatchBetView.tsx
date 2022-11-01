import React, { useEffect, useRef, useState } from 'react'
import { Button, IconButton } from '@mui/material'
import { MatchBetWithRelations, WinnerSide } from '../types'
import CloseIcon from '@mui/icons-material/CloseRounded'
import { isEmpty } from 'lodash'



interface Props  {
    bet: MatchBetWithRelations
    onClose: () => void
    onSave: (...args: any) => Promise<void>
    opener?: WinnerSide
}

function EditMatchBetView({
    bet,
    onClose,
    onSave,
    opener,
}: Props) {

    const homeInputRef = useRef<HTMLInputElement>()
    const awayInputRef = useRef<HTMLInputElement>()
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

    useEffect(()=>{
        if (opener === WinnerSide.Home){
            homeInputRef.current.select()
        } else if (opener === WinnerSide.Away) {
            awayInputRef.current.select()
        }
    }, [opener])


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
                        ref={homeInputRef}
                        onChange={homeScoreChange}
                        className={`form-control open-match-input`}
                        type="tel"
                        onClick={(e: any) => e.target.select()}
                        value={homeScore}
                    />
                </div>
                <div>
                    -
                </div>
                <div className='scoreDisplayContainer'>
                    <input
                        ref={awayInputRef}
                        onChange={awayScoreChange}
                        className={`form-control open-match-input`}
                        type="tel"
                        onClick={(e: any) => e.target.select()}
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
