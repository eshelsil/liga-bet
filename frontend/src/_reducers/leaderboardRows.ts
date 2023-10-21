import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { ScoreboardRow } from '../types'


type ScoreboardRowsListByVersionId = Record<number, ScoreboardRow[]>
type State = Record<number, ScoreboardRowsListByVersionId>

interface SetPayload {
    tournamentId: number,
    leaderboardRowsByVersionId: ScoreboardRowsListByVersionId,
}



const leaderboardRows = createSlice({
    name: 'leaderboardRows',
    initialState: {} as State,
    reducers: {
        updateMany: (
            state,
            action: PayloadAction<SetPayload>
        ) => {
            const {tournamentId, leaderboardRowsByVersionId} = action.payload
            if (!state[tournamentId]){
                state[tournamentId] = {}
            }
            state[tournamentId] = {
                ...state[tournamentId],
                ...leaderboardRowsByVersionId,
            }
        },
    },
})

export default leaderboardRows
