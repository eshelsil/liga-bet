import React from 'react'
import { useSelector } from 'react-redux'
import TeamFlag from '../TeamFlag/TeamFlag'
import { WinnerSide } from '../../types'
import { MatchResultProps } from './types'
import { IsQualifierBetOn } from '../../_selectors'
import { getWinnerSide } from '../../utils'
import './MatchResultV2.scss'


function MatchResultV2({home, away, isKnockout, qualifier, title, isTwoLeggedTie}: MatchResultProps){
    const isQualifierBetOn = useSelector(IsQualifierBetOn)
    const isQualifierBettable = isQualifierBetOn && isKnockout
    const koWinner = isQualifierBettable
        ? (isTwoLeggedTie ? qualifier : getWinnerSide(home.score, away.score, qualifier))
        : null

    return (
        <div className='LB-MatchResultV2'>
            {!!title && (
                <div className='MatchResult-title'>
                    {title}
                </div>
            )}
            <div className='MatchResult-content'>
                <div className='MatchResult-side MatchResult-home'>
                    <div className='MatchResult-teamAndScore'>
                        <TeamFlag size={32} team={home.team} />
                        <div className={'MatchResult-score'}>
                            {home.score}
                        </div>
                    </div>
                    {koWinner === WinnerSide.Home && (
                        <div className={'MatchResult-qualifier'}>
                            ✌️
                        </div>
                    )}
                </div>
                <div className='MatchResult-delimiter'>
                    <div>
                        -
                    </div>
                </div>
                <div className='MatchResult-side MatchResult-away'>
                    <div className='MatchResult-teamAndScore'>
                        <TeamFlag size={32} team={away.team} />
                        <div className={'MatchResult-score'}>
                            {away.score}
                        </div>
                    </div>
                    {koWinner === WinnerSide.Away && (
                        <div className={'MatchResult-qualifier'}>
                            ✌️
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MatchResultV2
