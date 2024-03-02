import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { DialogName } from '../dialogs/types'

export interface DialogsDataRecord {
    [DialogName.GameScoreInfo]: {
        gameId: number,
    },
    [DialogName.SendNihus]: {
        targetUtlId: number,
        gameId: number,
    },
}

export type SetDialogDataPayload = {
    [K in keyof DialogsDataRecord]-?: {
        dialog: K;
        data: DialogsDataRecord[K];
    };
}[keyof DialogsDataRecord];

export type DialogsDataState = Partial<DialogsDataRecord>

const dialogsData = createSlice({
    name: 'dialogsData',
    initialState: {} as DialogsDataState,
    reducers: {
        setData: (state, action: PayloadAction<SetDialogDataPayload>) => {
            const {dialog, data} = action.payload
            return {
                ...state,
                [dialog]: data,
            }
        },
        clearData: (state, action: PayloadAction<DialogName>) => {
            const name = action.payload
            delete state[name]
            return state;
        },
    },
})

export default dialogsData
