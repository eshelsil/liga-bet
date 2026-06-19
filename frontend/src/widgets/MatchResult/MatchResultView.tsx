import React from 'react'
import { useSelector } from 'react-redux'
import TeamFlag from '../TeamFlag/TeamFlag'
import { WinnerSide } from '../../types'
import { MatchResultProps } from './types'
import { IsQualifierBetOn } from '../../_selectors'
import { cn, getWinnerSide } from '../../utils'
import './MatchResult.scss'
import AutoBetBadge from '../AutoBetBadge/AutoBetBadge'


function MatchResultView({home, away, isKnockout, qualifier, isAutoBet, title}: MatchResultProps){

    const isQualifierBetOn = useSelector(IsQualifierBetOn)
    const isQualifierBettable = isQualifierBetOn && isKnockout
    
    const isTiedGame = !getWinnerSide(home.score, away.score)
    const hasFullScore = (typeof home.fullScore === 'number') && (typeof away.fullScore === 'number')
    const showFullScore = isQualifierBettable && isTiedGame && hasFullScore
    return (
        <div className={`LB-MatchResult ${isAutoBet ? 'GameBetsTable-autoBet' : ''}`}>
            {!!title && (
                <div className='MatchResult-title'>
                    {title}
                </div>
            )}
            <div className='MatchResult-content'>
                <div className='MatchResult-side'>
                    <TeamFlag size={32} team={home.team} />
                    <div className={'MatchResult-row'}>
                        {home.score}
                    </div>
                    {showFullScore && (
                        <div className={'MatchResult-row'}>
                            ({home.fullScore})
                        </div>
                    )}
                    {isQualifierBettable && qualifier === WinnerSide.Home && (
                        <div className={'MatchResult-row'}>
                            ✌️
                        </div>
                    )}
                </div>
                <div className='MatchResult-delimiter'>
                    <div>
                        -
                    </div>
                    {isQualifierBettable && (<>
                        {(!!qualifier || showFullScore) && (
                            <div className={'MatchResult-row'}>
                                90'
                            </div>
                        )}
                        {showFullScore && (
                            <div className={'MatchResult-row'}>
                                120'
                            </div>
                        )}
                        {!!qualifier && (
                            <div className={'MatchResult-row'}>
                                מעפילה
                            </div>
                        )}
                    </>)}
                </div>
                <div className='MatchResult-side'>
                    <TeamFlag size={32} team={away.team} />
                    <div className={'MatchResult-row'}>
                        {away.score}
                    </div>
                    {showFullScore && (
                        <div className={'MatchResult-row'}>
                            ({away.fullScore})
                        </div>
                    )}
                    {isQualifierBettable && qualifier === WinnerSide.Away && (
                        <div className={'MatchResult-row'}>
                            ✌️
                        </div>
                    )}
                </div>
                {isAutoBet && (
                    <div className={cn('absolute left-1/2 -translate-x-1/2', {
                        'bottom-2':!isQualifierBettable,
                        'top-6 scale-75':isQualifierBettable
                    })}>
                        <AutoBetBadge />
                    </div>
                )}
            </div>
        </div>
    )
}

export default MatchResultView
