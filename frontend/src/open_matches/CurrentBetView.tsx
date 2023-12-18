import React from 'react'
import { IconButton } from '@mui/material'
import { MatchBetWithRelations, WinnerSide } from '../types'
import EditIcon from '@mui/icons-material/Edit';
import { useSelector } from 'react-redux';
import { IsQualifierBetOn } from '../_selectors';
import KoWinnerInput from '../widgets/koWinnerInput';
import { getWinnerSide } from '../utils';



function CurrentBetView({
    bet,
    onEdit,
}: {
    bet: MatchBetWithRelations
    onEdit: (opener?: WinnerSide) => void
}) {
    const { result_home: homeScore, result_away: awayScore, winner_side: koWinner, relatedMatch} = bet
    
    const clickOnHomeScore = () => onEdit(WinnerSide.Home)
    const clickOnAwayScore = () => onEdit(WinnerSide.Away)
    const clickOnEditIcon = () => onEdit()

    const isKnockout = relatedMatch?.is_knockout
    const isTwoLegsKo = relatedMatch?.isTwoLeggedTie
    const isFirstLeg = relatedMatch?.isFirstLeg
    const isQualifierBetOn = useSelector(IsQualifierBetOn)
    const hasQualifierBet = isQualifierBetOn && isKnockout

    const isMissingQualifierOnFirstLeg = !!(hasQualifierBet && isTwoLegsKo && !isFirstLeg && !koWinner)

    const winnerSide = hasQualifierBet
        ? (
            isTwoLegsKo
                ? koWinner
                : getWinnerSide(homeScore, awayScore, koWinner)
        )
        : undefined


    return (
        <div className='LB-CurrentBetView'>
            {hasQualifierBet && isTwoLegsKo && (
                <KoWinnerInput
                    value={winnerSide}
                    setValue={() => {}}
                    isTwoLegKo
                    disabled
                    isMissing={isMissingQualifierOnFirstLeg}
                />
            )}
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
            {hasQualifierBet && !isTwoLegsKo && (
                <KoWinnerInput
                    value={winnerSide}
                    setValue={() => {}}
                    onlyDisplay
                />
            )}
            <div className='buttonContainer'>
                <IconButton onClick={clickOnEditIcon}>
                    <EditIcon />
                </IconButton>
            </div>
        </div>
    )
}

export default CurrentBetView
