import React from 'react'
import TeamFlag from '../TeamFlag/TeamFlag'
import { WinnerSide } from '../../types'
import { MatchResultProps } from './types'
import './MatchResultV2.scss'


function MatchResultV2({home, away, qualifier, title}: MatchResultProps){
    const hasFullScore = (home.fullScore !== undefined) && (away.fullScore !== undefined)
    const isQualifierBettable = !!qualifier
    const showFullScore = isQualifierBettable && hasFullScore
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
                        <TeamFlag size={32} name={home.team.name} />
                        <div className={'MatchResult-score'}>
                            {home.score}
                        </div>
                    </div>
                        {qualifier === WinnerSide.Home && (
                            <div className={'MatchResult-qualifier'}>
                                ✌️
                            </div>
                        )}
                </div>
                <div className='MatchResult-delimiter'>
                    <div>
                        -
                    </div>
                    {isQualifierBettable && (<>
                        <div className={'qualifierDelimiter'}>
                            מעפילה
                        </div>
                    </>)}
                </div>
                <div className='MatchResult-side MatchResult-away'>
                    <div className='MatchResult-teamAndScore'>
                        <TeamFlag size={32} name={away.team.name} />
                        <div className={'MatchResult-score'}>
                            {away.score}
                        </div>
                    </div>
                    {qualifier === WinnerSide.Away && (
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
