import React from 'react'
import { useIsXsScreen } from '../../hooks/useMedia'
import TeamWithFlag from '../TeamFlag/TeamWithFlag'
import { getHebGroupName } from '../../strings/groups'
import { GroupStandingProps, TeamDisplayProps } from './types'
import './style.scss'


function TeamDisplay({team, rank, highlight}: TeamDisplayProps){
    const isXsScreen = useIsXsScreen()
    const size = isXsScreen ? 32 : 40
    return (
        <div className={`LB-TeamDisplay ${highlight ? 'TeamDisplay-highlight' : ''}`}>
            <div className='TeamDisplay-rank'>
                {rank}
            </div>
            <TeamWithFlag size={size} team={team} />
        </div>
    )
}

function GroupStandingsResult({standings, name, highlightRank}: GroupStandingProps){
    const extraClass = !name ? 'GroupStandingsResult-noName' : ''
    return (
        <div className={`LB-GroupStandingsResult ${extraClass}`}>
            {name && (
                <div className='GroupStandingsResult-header'>
                    {getHebGroupName(name)}
                </div>
            )}
            <div>
                {standings.map((team, index) => (
                    <TeamDisplay key={team.id} team={team} rank={index + 1} highlight={index + 1 === highlightRank} />
                ))}
            </div>
        </div>
    )
}

export default GroupStandingsResult
