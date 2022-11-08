import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux'
import { updateCurrentTournamentNotifications } from '../_actions/notifications';
import { AppDispatch } from '../_helpers/store';
import { HasFetchedAllTournamentInitialData, MissingBetsCount } from '../_selectors';

export function useCurrentTournamentNotificationsUpdater(){
    const dispatch = useDispatch<AppDispatch>();
    const updateFunc = () => dispatch(updateCurrentTournamentNotifications())
    const hasInitialData = useSelector(HasFetchedAllTournamentInitialData)
    const missingBetsCount = useSelector(MissingBetsCount)
    
    useEffect(() => {
        if (hasInitialData){
            updateFunc()
        }
    }, [hasInitialData, missingBetsCount])

    return {
        updateFunc,
    }
}