import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'


interface ExplanationDialogState {
    seen: boolean,
    dontShowAgain: boolean,
    initialized: boolean,
}
interface State {
    forAllTournaments: boolean
    explainationDialog: ExplanationDialogState
}

const multiBetsSettings = createSlice({
    name: 'multiBetsSettings',
    initialState: {
        forAllTournaments: false,
        explainationDialog: {
            seen: false,
            dontShowAgain: !!localStorage.getItem('ligaBetDontShowMultiBetExplanation'),
            initialized: false,
        }
    } as State,
    reducers: {
        update: (state, action: PayloadAction<Partial<State>>) => ({
            ...state,
            ...action.payload,
        }),
        updateExplanationDialog: (state, action: PayloadAction<Partial<ExplanationDialogState>>) => {
            state.explainationDialog = {
                ...state.explainationDialog,
                ...action.payload,
            }
        }
    },
})

export default multiBetsSettings
