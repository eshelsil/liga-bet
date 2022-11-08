import React from 'react'
import TeamFlag from '../widgets/TeamFlag/TeamFlag'
import { Team, WinnerSide } from '../types'


interface TeamMacthData {
    team: Team,
    score: number,
    fullScore?: number,
}

interface Props {
    home: TeamMacthData
    away: TeamMacthData,
    qualifier?: WinnerSide,
}


function MatchResult({home, away, qualifier}: Props){
    const hasFullScore = (home.fullScore !== undefined) && (away.fullScore !== undefined)
    const isQualifierBettable = !!qualifier
    const showFullScore = isQualifierBettable && hasFullScore
    return (
        <div className='LB-MatchResult'>
            <div className='MatchResult-side'>
                <TeamFlag size={32} name={home.team.name} />
                <div className={'MatchResult-row'}>
                    {home.score}
                </div>
                {showFullScore && (
                    <div className={'MatchResult-row'}>
                        {home.fullScore}
                    </div>
                )}
                {qualifier === WinnerSide.Home && (
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
                    <div className={'MatchResult-row'}>
                        90'
                    </div>
                    {showFullScore && (
                        <div className={'MatchResult-row'}>
                            120'
                        </div>
                    )}
                    {isQualifierBettable && (
                        <div className={'MatchResult-row'}>
                            מעפילה
                        </div>
                    )}
                </>)}
            </div>
            <div className='MatchResult-side'>
                <TeamFlag size={32} name={away.team.name} />
                <div className={'MatchResult-row'}>
                    {away.score}
                </div>
                {showFullScore && (
                    <div className={'MatchResult-row'}>
                        {away.fullScore}
                    </div>
                )}
                {qualifier === WinnerSide.Away && (
                    <div className={'MatchResult-row'}>
                        ✌️
                    </div>
                )}
            </div>
        </div>
    )
}

export default MatchResult
