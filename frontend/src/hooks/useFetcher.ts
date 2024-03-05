import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { AsyncAction, GameBetsFetchType, FetchGameBetsParams } from '../types';
import { fetchAndStorePrimalBets, fetchGameBetsThunk, initPrimalBets } from '../_actions/bets';
import { fetchAndStoreContestants, initContestants } from '../_actions/contestants';
import { fetchAndStoreGroups, initGroups } from '../_actions/groups';
import { fetchAndStoreLeaderboardVersions, fetchLeaderboardsThunk, initLeaderboardVersions } from '../_actions/leaderboard';
import { fetchAndStoreGoalsData, fetchAndStoreMatches, initGames, initGoalsData } from '../_actions/matches';
import { fetchAndStoreNotifications } from '../_actions/notifications';
import { fetchAndStorePlayers, initPlayers } from '../_actions/players';
import { fetchAndStoreQuestions, initSpecialQuestions } from '../_actions/specialQuestions';
import { fetchAndStoreTeams, initTeams } from '../_actions/teams'
import { AppDispatch } from '../_helpers/store'
import gameBetsFetcher from '../_reducers/gameBetsFetcher';
import { CurrentTournamentUserId, GameIds, IsConfirmedUtl, LatestLeaderboardVersion, LiveGamesIds, MyUtls, NotificationsState, ScoreboardSettingsState, TournamentIdSelector } from '../_selectors';
import { HasFetchedAllTournamentInitialData } from '../_selectors';
import leaderboardsFetcher from '../_reducers/leaderboardsFetcher';
import { generateDefaultScoreboardSettings, isUtlConfirmed, valuesOf } from '../utils';
import { filter, isEmpty } from 'lodash';
import { fetchAndStoreCompetitions } from '../_actions/competition';
import { fetchAndStoreNihusGrants, fetchAndStoreNihusim, initNihusGrants } from '@/_actions/nihusim';

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
    const isConfirmed = useSelector(IsConfirmedUtl)

    
    useEffect(() => {
        if (!currentTournamentId || !isConfirmed) {
            return
        }
        if (refreshable){
            refresh()
        } else {
            init()
        }
    }, [currentTournamentId, isConfirmed, refreshable])

    return {
        refresh,
    }
}



export function useCompetitions() {
    const dispatch = useDispatch<AppDispatch>();
    useEffect(()=> {
        dispatch(fetchAndStoreCompetitions())
    }, [])
}

export function useNihusim() {
    const liveGameIds = useSelector(LiveGamesIds)
    const hasLive = liveGameIds.length > 0;
    const dispatch = useDispatch<AppDispatch>();
    const fetch = () => dispatch(fetchAndStoreNihusim())
    const refresh = () => {
        console.log('refreshing')
        if (hasLive){
            fetch()
        }
    }
    useEffect(()=> {
        fetch()
        const interval = setInterval(refresh, 1000 * 60)
        return () => clearInterval(interval)
        
    }, [refresh])
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

export function useGameGoals(refreshable?: boolean) {
    return useFetcher({
        refreshable,
        refreshFunc: fetchAndStoreGoalsData,
        initFunc: initGoalsData,
    })
}

export function useNihusGrants(refreshable?: boolean) {
    return useFetcher({
        refreshable,
        refreshFunc: fetchAndStoreNihusGrants,
        initFunc: initNihusGrants,
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

export function useLeaderboardVersions(refreshable?: boolean) {
    return useFetcher({
        refreshable,
        refreshFunc: fetchAndStoreLeaderboardVersions,
        initFunc: initLeaderboardVersions,
    })
}


export function useLeaderboard(targetTournamentId?: number, ids?: number[]){
    const dispatch = useDispatch<AppDispatch>();
    const currentTournamentId = useSelector(TournamentIdSelector)
    const latestVersion = useSelector(LatestLeaderboardVersion)
    const scoreboardSettingsState = useSelector(ScoreboardSettingsState)
    const utlsById = useSelector(MyUtls)
    
    const tournamentId = targetTournamentId ?? currentTournamentId
    const utl = valuesOf(utlsById).find(utl => utl.tournament.id === tournamentId)
    const scoreboardSettings = scoreboardSettingsState[tournamentId] ?? generateDefaultScoreboardSettings()
    const { liveMode, upToDateMode, showChange, originVersion, destinationVersion } = scoreboardSettings || {}

    if (!ids){
        ids = liveMode ? [] : filter([
            showChange ? originVersion?.id : null,
            !upToDateMode ? destinationVersion?.id : latestVersion?.id
        ])
    }
    const fetchFunc = () => dispatch(fetchLeaderboardsThunk(ids, tournamentId))
    const isConfirmed = !!utl && isUtlConfirmed(utl)
    const refetch = async () => {
        dispatch(leaderboardsFetcher.actions.markUnfetched({ids, tournamentId}))
        await fetchFunc()
    }

    
    useEffect(() => {
        if (!tournamentId || !isConfirmed){
            return
        }
        fetchFunc()
    }, [tournamentId, isConfirmed, JSON.stringify(ids)])

    return {
        fetchFunc,
        refetch,
    }
}

export function usePrimalBets(refreshable?: boolean) {
    return useFetcher({
        refreshable,
        refreshFunc: fetchAndStorePrimalBets,
        initFunc: initPrimalBets,
    })
}


export function useGameBets(params: Omit<FetchGameBetsParams, "tournamentId">){
    const dispatch = useDispatch<AppDispatch>();
    const fetchFunc = (params: FetchGameBetsParams) => dispatch(fetchGameBetsThunk(params))
    const currentTournamentId = useSelector(TournamentIdSelector)
    const isConfirmed = useSelector(IsConfirmedUtl)
    const refetch = async () => {
        const allParams = {...params, tournamentId: currentTournamentId}
        dispatch(gameBetsFetcher.actions.markUnfetched(allParams))
        await fetchFunc(allParams)
    }

    
    useEffect(() => {
        const ts = Number(new Date())
        if (!currentTournamentId || !isConfirmed){
            return
        }
        fetchFunc({...params, tournamentId: currentTournamentId})
    }, [currentTournamentId, isConfirmed, params])

    return {
        fetchFunc,
        refetch,
    }
}

export function useMyGameBets(){
    const utlId = useSelector(CurrentTournamentUserId);
    useGameBets({type: GameBetsFetchType.Users, ids: [utlId]})
}

export function useGameBetsOfUtl(utlId: number){
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
    const notificationsState = useSelector(NotificationsState)
    const alreadyFetched = !isEmpty(notificationsState)
    
    useEffect(() => {
        if (hasInitialData && !alreadyFetched){
            fetchFunc()
        }
    }, [hasInitialData, alreadyFetched])

    return {
        fetchFunc,
    }
}