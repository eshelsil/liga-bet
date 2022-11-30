import React, { useEffect, useRef, useState } from 'react'
import { IconButton } from '@mui/material'
import { MatchBetWithRelations, WinnerSide } from '../types'
import CloseIcon from '@mui/icons-material/CloseRounded'
import { isEmpty } from 'lodash'
import { LoadingButton } from '../widgets/Buttons'
import { useSelector } from 'react-redux'
import { IsQualifierBetOn } from '../_selectors'
import KoWinnerInput from '../widgets/koWinnerInput'
import { getWinnerSide } from '../utils'



interface Props  {
    bet: MatchBetWithRelations
    isKnockout: boolean
    onClose: () => void
    onSave: (...args: any) => Promise<void>
    opener?: WinnerSide
}

function EditMatchBetView({
    bet,
    isKnockout,
    onClose,
    onSave,
    opener,
}: Props) {

    const homeInputRef = useRef<HTMLInputElement>()
    const awayInputRef = useRef<HTMLInputElement>()
    const [homeScore, setHomeScore] = useState(bet?.result_home ?? '')
    const [awayScore, setAwayScore] = useState(bet?.result_away ?? '')
    const [koWinner, setKoWinner] = useState(bet?.winner_side ?? null)
    const hasBet = !isEmpty(bet)
    const isQualifierBetOn = useSelector(IsQualifierBetOn)
    const hasQualifierBet = isQualifierBetOn && isKnockout

    const isFilled = homeScore !== '' &&  awayScore !== ''

    
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

    const saveBet = async () => {
        await onSave({
            homeScore,
            awayScore,
            koWinner,
        })
    }

    useEffect(()=>{
        if (opener === WinnerSide.Home){
            homeInputRef.current.select()
        } else if (opener === WinnerSide.Away) {
            awayInputRef.current.select()
        }
    }, [opener])

    const isBetTied = Number(homeScore) === Number(awayScore)

    const winnerSide = (hasQualifierBet && isKnockout)
        ? getWinnerSide(Number(homeScore), Number(awayScore), koWinner)
        : undefined

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
            {hasQualifierBet && (
                <KoWinnerInput
                    value={isFilled ? winnerSide : undefined}
                    setValue={setKoWinner}
                    onlyDisplay={!isBetTied || !isFilled}
                />
            )}
            <div className='buttonContainer'>
                <div className='buttonsWrapper'>
                    <LoadingButton
                        classes={{root: 'sendButton'}}
                        action={saveBet}
                    >
                        שלח
                    </LoadingButton>
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
