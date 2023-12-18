import React, { useEffect, useRef, useState } from 'react'
import { IconButton } from '@mui/material'
import { MatchBetWithRelations, WinnerSide } from '../types'
import CloseIcon from '@mui/icons-material/CloseRounded'
import { LoadingButton } from '../widgets/Buttons'
import { useSelector } from 'react-redux'
import { IsQualifierBetOn } from '../_selectors'
import KoWinnerInput from '../widgets/koWinnerInput'
import { getWinnerSide } from '../utils'



interface Props  {
    bet: MatchBetWithRelations
    isKnockout: boolean
    isTwoLegsKo: boolean
    isFirstLeg: boolean
    onClose: () => void
    onSave: (...args: any) => Promise<void>
    opener?: WinnerSide
}

function EditMatchBetView({
    bet,
    isKnockout,
    isTwoLegsKo,
    isFirstLeg,
    onClose,
    onSave,
    opener,
}: Props) {

    const homeInputRef = useRef<HTMLInputElement>()
    const awayInputRef = useRef<HTMLInputElement>()
    const [homeScore, setHomeScore] = useState(bet?.result_home ?? '')
    const [awayScore, setAwayScore] = useState(bet?.result_away ?? '')
    const [koWinner, setKoWinner] = useState(bet?.winner_side ?? null)
    const hasBet = !([undefined, null].includes(bet?.result_away))
    const isQualifierBetOn = useSelector(IsQualifierBetOn)
    const hasQualifierBet = isQualifierBetOn && isKnockout

    const isMissingQualifierOnFirstLeg = !!(hasQualifierBet && isTwoLegsKo && !isFirstLeg && !bet?.winner_side)
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

    useEffect(()=>{
        if (bet?.winner_side != koWinner){
            setKoWinner(bet?.winner_side)
        }
    }, [bet?.winner_side])

    const isBetTied = Number(homeScore) === Number(awayScore)

    const winnerSide = hasQualifierBet
        ? (
            isTwoLegsKo
                ? koWinner
                : getWinnerSide(Number(homeScore), Number(awayScore), koWinner)
        )
        : undefined

    return (
        <div className={`LB-EditMatchBetView`}>
            {hasQualifierBet && isTwoLegsKo && (
                <KoWinnerInput
                    value={winnerSide}
                    setValue={setKoWinner}
                    disabled={isTwoLegsKo && !isFirstLeg}
                    isTwoLegKo
                    isMissing={isMissingQualifierOnFirstLeg}
                />
            )}
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
            {hasQualifierBet && !isTwoLegsKo && (
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
