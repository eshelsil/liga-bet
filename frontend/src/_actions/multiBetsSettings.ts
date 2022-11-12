import { AppDispatch, GetRootState } from '../_helpers/store'
import multiBetsSettingsSlice from '../_reducers/multiBetsSettings'


function updateForAllTournamentsDefault(value: boolean) {
    return async (dispatch: AppDispatch, getState: GetRootState) => {
        dispatch(multiBetsSettingsSlice.actions.update({forAllTournaments: value}))
    }
}

function updateSeenMultiBetExplanationDialog() {
    return async (dispatch: AppDispatch, getState: GetRootState) => {
        dispatch(multiBetsSettingsSlice.actions.updateExplanationDialog({seen: true}))
    }
}

function initializeMultiBetExplanationDialog() {
    return async (dispatch: AppDispatch, getState: GetRootState) => {
        dispatch(multiBetsSettingsSlice.actions.updateExplanationDialog({initialized: true}))
    }
}

function updateDontShowAgainMultiBetExplanation(value: boolean) {
    return async (dispatch: AppDispatch, getState: GetRootState) => {
        if (value){
            localStorage.setItem('ligaBetDontShowMultiBetExplanation', '1')
        } else {
            localStorage.removeItem('ligaBetDontShowMultiBetExplanation')
        }
        dispatch(multiBetsSettingsSlice.actions.updateExplanationDialog({dontShowAgain: value}))
    }
}

export {
    updateForAllTournamentsDefault,
    updateSeenMultiBetExplanationDialog,
    initializeMultiBetExplanationDialog,
    updateDontShowAgainMultiBetExplanation,
}
