import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { AsyncAction, GameBetsFetchType, FetchGameBetsParams } from '../types';
import { fetchAndStorePrimalBets, fetchGameBetsThunk, initPrimalBets } from '../_actions/bets';
import { fetchAndStoreContestants, initContestants } from '../_actions/contestants';
import { fetchAndStoreGroups, initGroups } from '../_actions/groups';
import { fetchAndStoreLeaderboard, initLeaderboard } from '../_actions/leaderboard';
import { fetchAndStoreMatches, initGames } from '../_actions/matches';
import { fetchAndStoreNotifications } from '../_actions/notifications';
import { fetchAndStorePlayers, initPlayers } from '../_actions/players';
import { fetchAndStoreQuestions, initSpecialQuestions } from '../_actions/specialQuestions';
import { fetchAndStoreTeams, initTeams } from '../_actions/teams'
import { AppDispatch } from '../_helpers/store'
import { CurrentTournamentUserId, GameIds, TournamentIdSelector } from '../_selectors';
import { HasAllOtherTournamentsNotifications, HasFetchedAllTournamentInitialData } from '../_selectors';

function useFetcher({
    refreshable,
    refreshFunc,
    initFunc,
}: {
    refreshable?: boolean,
    refreshFunc: () => AsyncAction,
    initFunc: () => AsyncAction,
}
) {
    const dispatch = useDispatch<AppDispatch>();
    const refresh = () => dispatch(refreshFunc())
    const init = () => dispatch(initFunc())
    const currentTournamentId = useSelector(TournamentIdSelector)

    
    useEffect(() => {
        if (!currentTournamentId) {
            return
        }
        if (refreshable){
            refresh()
        } else {
            init()
        }
    }, [currentTournamentId, refreshable])

    return {
        refresh,
    }
}



export function useTeams(refreshable?: boolean) {
    return useFetcher({
        refreshable,
        refreshFunc: fetchAndStoreTeams,
        initFunc: initTeams,
    })
}

export function usePlayers(refreshable?: boolean) {
    return useFetcher({
        refreshable,
        refreshFunc: fetchAndStorePlayers,
        initFunc: initPlayers,
    })
}

export function useGames(refreshable?: boolean) {
    return useFetcher({
        refreshable,
        refreshFunc: fetchAndStoreMatches,
        initFunc: initGames,
    })
}

export function useGroups(refreshable?: boolean) {
    return useFetcher({
        refreshable,
        refreshFunc: fetchAndStoreGroups,
        initFunc: initGroups,
    })
}

export function useContestants(refreshable?: boolean) {
    return useFetcher({
        refreshable,
        refreshFunc: fetchAndStoreContestants,
        initFunc: initContestants,
    })
}

export function useSpecialQuestions(refreshable?: boolean) {
    return useFetcher({
        refreshable,
        refreshFunc: fetchAndStoreQuestions,
        initFunc: initSpecialQuestions,
    })
}

export function useLeaderboard(refreshable?: boolean) {
    return useFetcher({
        refreshable,
        refreshFunc: fetchAndStoreLeaderboard,
        initFunc: initLeaderboard,
    })
}

export function usePrimalBets(refreshable?: boolean) {
    return useFetcher({
        refreshable,
        refreshFunc: fetchAndStorePrimalBets,
        initFunc: initPrimalBets,
    })
}


export function useGameBets(params: FetchGameBetsParams){
    const dispatch = useDispatch<AppDispatch>();
    const fetchFunc = (params: FetchGameBetsParams) => dispatch(fetchGameBetsThunk(params))
    const currentTournamentId = useSelector(TournamentIdSelector)

    
    useEffect(() => {
        if (!currentTournamentId){
            return
        }
        fetchFunc(params)
    }, [currentTournamentId, params])

    return {
        fetchFunc,
    }
}

export function useMyGameBets(){
    const utlId = useSelector(CurrentTournamentUserId);
    useGameBets({type: GameBetsFetchType.Users, ids: [utlId]})
}

export function useAllGameBets(){
    const gameIds = useSelector(GameIds);
    useGameBets({type: GameBetsFetchType.Games, ids: gameIds})
}


export function useFetchNotifications(){
    const dispatch = useDispatch<AppDispatch>();
    const fetchFunc = () => dispatch(fetchAndStoreNotifications())
    const hasInitialData = useSelector(HasFetchedAllTournamentInitialData)
    const alreadyFetched = useSelector(HasAllOtherTournamentsNotifications)
    
    useEffect(() => {
        if (hasInitialData && !alreadyFetched){
            fetchFunc()
        }
    }, [hasInitialData, alreadyFetched])

    return {
        fetchFunc,
    }
}