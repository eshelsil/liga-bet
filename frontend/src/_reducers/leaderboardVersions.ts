import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { LeaderboardVersion } from '../types'
import { LeaderboardVersionApiModel } from '../types'


type State = Record<number, LeaderboardVersion[]>

interface SetPayload {
    tournamentId: number,
    leaderboardVersions: LeaderboardVersionApiModel[],
}



const leaderboardVersions = createSlice({
    name: 'leaderboardVersions',
    initialState: {} as State,
    reducers: {
        set: (
            state,
            action: PayloadAction<SetPayload>
        ) => {
            const {tournamentId, leaderboardVersions} = action.payload
            const versionsLength = leaderboardVersions.length
            state[tournamentId] = leaderboardVersions.map((version, index) => ({...version, order: versionsLength - index}))
        },
        createPlaceholderVersionIfMissing: (
            state,
            action: PayloadAction<{tournamentId: number, id: number}>
        ) => {
            const {tournamentId, id} = action.payload
            if (!state[tournamentId]){
                state[tournamentId] = []
            }
            const versions = state[tournamentId]
            const version = versions.find(v => v.id == id)
            if (!version){
                versions.push({
                    id,
                    description: '',
                    gameId: 0,
                    created_at: JSON.stringify(new Date()),
                    order: 1,
                    isPlaceholder: true,
                })
            }
        },
    },
})

export default leaderboardVersions
