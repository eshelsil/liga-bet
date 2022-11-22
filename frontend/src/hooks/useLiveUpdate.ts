import { useSelector } from 'react-redux';
import { pingUpdateCompetition } from '../api/matches';
import { GameBetsFetchType } from '../types';
import { LiveGamesIds } from '../_selectors';
import { useGameBets, useGameGoals, useGames, useLeaderboard } from './useFetcher';


export function useLiveUpdate(){
    const liveGames = useSelector(LiveGamesIds)
    const { refetch: refreshGameBets } = useGameBets({type: GameBetsFetchType.Games, ids: liveGames})
    const { refresh: refreshGames } = useGames()
    const { refresh: refreshGoalsData } = useGameGoals()
    const { refresh: refreshLeaderboard } = useLeaderboard()

    const fetchRelevantData = async () => {
        await Promise.all([
            refreshGames(),
            refreshLeaderboard(),
            refreshGameBets(),
            refreshGoalsData(),
        ])
    }

    const sendPingRequestAndRefresh = async () => {
        await pingUpdateCompetition()
        await fetchRelevantData()
    }

    const refresh = async () => {
        await fetchRelevantData()
        await sendPingRequestAndRefresh()
    }

    return {
        refresh,
    }
}