import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { GameBetsFetchType } from '../types';
import { fetchAndStoreLivePlayingPlayers } from '../_actions/players';
import { AppDispatch } from '../_helpers/store';
import { LatestLeaderboardVersion, LiveGamesIds, ScoreboardSettings } from '../_selectors';
import { useGameBets, useGameGoals, useGames, useLeaderboardVersions, usePrimalBets, useSpecialQuestions } from './useFetcher';
import { showChangeFromLastSeenVersion } from '../_actions/scoreboardSettings';


export function useLiveUpdate(){
    const dispatch = useDispatch<AppDispatch>()
    const liveGames = useSelector(LiveGamesIds)
    const scoreboardSettings = useSelector(ScoreboardSettings)
    const latestScoreboardVersion = useSelector(LatestLeaderboardVersion)
    
    const { refetch: refreshGameBets } = useGameBets({type: GameBetsFetchType.Games, ids: liveGames})
    const { refresh: refreshGames } = useGames()
    const { refresh: refreshGoalsData } = useGameGoals()
    const { refresh: refreshLeaderboard } = useLeaderboardVersions()
    const { refresh: refreshPrimalBets } = usePrimalBets()
    const { refresh: refreshSpecialQuestions } = useSpecialQuestions()

    const latestSeenLeaderboardVersionId = (scoreboardSettings.upToDateMode && latestScoreboardVersion?.id)
        ? latestScoreboardVersion?.id
        : null

    const fetchRelevantData = async () => {        
        await Promise.all([
            refreshGames(),
            refreshLeaderboard(),
            refreshGameBets(),
            refreshGoalsData(),
            refreshPrimalBets(),
            refreshSpecialQuestions(),
        ])
    }

    const refresh = async () => {
        await fetchRelevantData()
        if (latestSeenLeaderboardVersionId){
            dispatch(showChangeFromLastSeenVersion(latestSeenLeaderboardVersionId))
        }
    }

    return {
        refresh,
    }
}

export function useMissingPlayersFetcher(){
    const dispatch = useDispatch<AppDispatch>()
    const liveGameIds = useSelector(LiveGamesIds)


    useEffect(() => {
        if (liveGameIds.length > 0) {
            dispatch(fetchAndStoreLivePlayingPlayers())
        }
    }, [liveGameIds])


    return {}
}