import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { ScoreboardRowById } from '../types'


export type ScoreboardRowsByVersionId = Record<number, ScoreboardRowById>
type State = Record<number, ScoreboardRowsByVersionId>

interface SetPayload {
    tournamentId: number,
    leaderboardRowsByVersionId: ScoreboardRowsByVersionId,
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
            for (const versionId of Object.keys(leaderboardRowsByVersionId)){
                state[tournamentId][versionId] = {
                    ...state[tournamentId][versionId],
                    ...leaderboardRowsByVersionId[versionId],
                }
            }
        },
    },
})

export default leaderboardRows
