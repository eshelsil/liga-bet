import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { LeaderboardVersionById } from '../types'
import { LeaderboardVersionApiModel } from '../types'
import { keyBy } from 'lodash'

const leaderboard = createSlice({
    name: 'leaderboardVersions',
    initialState: {} as LeaderboardVersionById,
    reducers: {
        setRows: (
            state,
            action: PayloadAction<LeaderboardVersionApiModel[]>
        ) => {
            for (const version of action.payload) {
                state[version.id] = {
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
