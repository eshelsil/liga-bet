import whatifSlice, { UpdateWhatifResultPayload, UpdateWhatifBetterPayload, UpdateWhatifScorerPayload } from '@/_reducers/whatif'
import { AppDispatch, GetRootState } from '../_helpers/store'

function updateWhatifScorerData(data: UpdateWhatifScorerPayload) {
    return async (dispatch: AppDispatch) => {
        dispatch(whatifSlice.actions.updateScorer(data))
    }
}
function updateWhatifBetter(data: UpdateWhatifBetterPayload) {
    return async (dispatch: AppDispatch, getState: GetRootState) => {
        dispatch(whatifSlice.actions.updateBetter(data))
    }
}
function updateWhatifGameResult(data: UpdateWhatifResultPayload) {
    return async (dispatch: AppDispatch, getState: GetRootState) => {
        dispatch(whatifSlice.actions.updateResult(data))
    }
}

function updateWhatifsIsOn(value: boolean) {
    return async (dispatch: AppDispatch, getState: GetRootState) => {
        dispatch(whatifSlice.actions.setIsON(value))
    }
}

export {
    updateWhatifScorerData,
    updateWhatifBetter,
    updateWhatifGameResult,
    updateWhatifsIsOn,
}
