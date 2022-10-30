import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { LeaderboardVersionById } from '../types'
import { LeaderboardVersionApiModel } from '../types'
import { keyBy } from 'lodash'


type State = Record<number, LeaderboardVersionById>

interface SetPayload {
    tournamentId: number,
    leaderboardVersions: LeaderboardVersionApiModel[],
}



const leaderboard = createSlice({
    name: 'leaderboardVersions',
    initialState: {} as State,
    reducers: {
        setRows: (
            state,
            action: PayloadAction<SetPayload>
        ) => {
            const {tournamentId, leaderboardVersions} = action.payload
            state[tournamentId] = state[tournamentId] ?? {};
            for (const version of leaderboardVersions) {
                state[tournamentId][version.id] = {
                    ...version,
                    leaderboard: keyBy(
                        version.leaderboard,
                        'user_tournament_id'
                    ),
                }
            }
        },
    },
})

export default leaderboard
