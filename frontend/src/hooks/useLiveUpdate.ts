import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { pingUpdateCompetition } from '../api/matches';
import { GameBetsFetchType } from '../types';
import { fetchAndStoreLivePlayingPlayers } from '../_actions/players';
import { AppDispatch } from '../_helpers/store';
import { LiveGamesIds } from '../_selectors';
import { useGameBets, useGameGoals, useGames, useLeaderboard, usePrimalBets, useSpecialQuestions } from './useFetcher';


export function useLiveUpdate(){
    const liveGames = useSelector(LiveGamesIds)
    const { refetch: refreshGameBets } = useGameBets({type: GameBetsFetchType.Games, ids: liveGames})
    const { refresh: refreshGames } = useGames()
    const { refresh: refreshGoalsData } = useGameGoals()
    const { refresh: refreshLeaderboard } = useLeaderboard()
    const { refresh: refreshPrimalBets } = usePrimalBets()
    const { refresh: refreshSpecialQuestions } = useSpecialQuestions()

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

    const sendPingRequestAndRefresh = async () => {
        await pingUpdateCompetition()
        await fetchRelevantData()
    }

    const refresh = async () => {
        const isTournamentDone = true
        await fetchRelevantData()
        if (!isTournamentDone) {
            await sendPingRequestAndRefresh()
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