import React from 'react'
import { Team } from '../types'
import { useIsXsScreen } from '../hooks/useMedia'
import TeamWithFlag from '../widgets/TeamFlag/TeamWithFlag'
import { getHebGroupName } from '../strings/groups'


function TeamDisplay({team, rank}: {team: Team, rank: number}){
    const isXsScreen = useIsXsScreen()
    const size = isXsScreen ? 32 : 40
    return (
        <div className='LB-TeamDisplay'>
            <div className='TeamDisplay-rank'>
                {rank}
            </div>
            <TeamWithFlag size={size} name={team.name} />
        </div>
    )
}



interface Props {
    standings: Team[],
    name: string,
}


function GroupStandingsResult({standings, name}: Props){
    return (
        <div className='LB-GroupStandingsResult'>
            <div className='GroupStandingsResult-header'>
                {getHebGroupName(name)}
            </div>
            <div>
                {standings.map((team, index) => (
                    <TeamDisplay key={team.id} team={team} rank={index + 1} />
                ))}
            </div>
        </div>
    )
}

export default GroupStandingsResult
