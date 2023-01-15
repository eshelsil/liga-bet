import React from 'react'
import { useSelector } from 'react-redux'
import { UtlBase } from '../../types'
import { CurrentTournamentId, IsCompetitionDone, IsMissingMvpAnswer, IsOurTournament, LeaderboardVersions } from '../../_selectors'
import CongratsAnimation from './CongratsAnimation'
import dayjs from 'dayjs'
import './Animation.scss'


interface Props {
    currentUtl: UtlBase
    rank: number
}

function CongratsAnimationProvider({ currentUtl, rank }: Props) {

    const tournamentId = useSelector(CurrentTournamentId)
    const isOurTournament = useSelector(IsOurTournament)
    const isCompetitionDone = useSelector(IsCompetitionDone)
    const leaderboardVersions = useSelector(LeaderboardVersions)
    const isMvpMissing = useSelector(IsMissingMvpAnswer)
    const tournamentDone = isCompetitionDone && !isMvpMissing

    const seenCongratsData = localStorage.getItem('LigaBetSeenCongratsAnimationV2')
    let lastSeenPerTournamentId: Record<number, number> = seenCongratsData ? JSON.parse(seenCongratsData) : {}
    const lastSeenTimestamp = lastSeenPerTournamentId[tournamentId]
    // const seenRecently = lastSeenTimestamp ? (dayjs().diff(dayjs(lastSeenTimestamp), 'hours') < 72) : false
    const seenRecently = false

    const onSeenAnimation = () => {
        if (seenCongratsData) {
            lastSeenPerTournamentId[tournamentId] = Number(new Date())
            localStorage.setItem('LigaBetSeenCongratsAnimationV2', JSON.stringify(lastSeenPerTournamentId))
        } else {
            localStorage.setItem('LigaBetSeenCongratsAnimationV2', JSON.stringify({[tournamentId]: Number(new Date())}))
        }
    }
    
    const loadedLeaderboards = Object.keys(leaderboardVersions).length > 0
    const showCongratsAnimation = tournamentDone && (isOurTournament || rank === 1) && loadedLeaderboards
    return (<>
        {showCongratsAnimation && !seenRecently && (
            <CongratsAnimation currentUtl={currentUtl} rank={rank} onSeenAnimation={onSeenAnimation} />
        )}
    </>)
}

export default CongratsAnimationProvider