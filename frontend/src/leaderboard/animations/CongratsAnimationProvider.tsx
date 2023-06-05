import React from 'react'
import { useSelector } from 'react-redux'
import { CongratsAnimationSelector, CurrentTournamentId, CurrentTournamentUser } from '../../_selectors'
import CongratsAnimation from './CongratsAnimation'
import './Animation.scss'



function CongratsAnimationProvider() {

    const { showCongratsAnimation, currentUtlRank} = useSelector(CongratsAnimationSelector)
    const currentUtl = useSelector(CurrentTournamentUser)
    const tournamentId = useSelector(CurrentTournamentId)

    const onSeenAnimation = () => {
        const seenCongratsData = localStorage.getItem('LigaBetSeenCongratsAnimation')
        const lastSeenPerTournamentId: Record<number, number> = seenCongratsData ? JSON.parse(seenCongratsData) : {}
        lastSeenPerTournamentId[tournamentId] = Number(new Date())
        localStorage.setItem('LigaBetSeenCongratsAnimation', JSON.stringify(lastSeenPerTournamentId))
    }
    
    return (<>
        {showCongratsAnimation && (
            <CongratsAnimation currentUtl={currentUtl} rank={currentUtlRank} onSeenAnimation={onSeenAnimation} />
        )}
    </>)
}

export default CongratsAnimationProvider