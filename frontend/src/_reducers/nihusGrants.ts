import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { NihusGrant, NihusGrantById, NotificationsByTournamentId } from '../types'


type NihusGrantByTounamentId = Record<number, NihusGrantById>

const nihusGrants = createSlice({
    name: 'nihusGrants',
    initialState: {} as NihusGrantByTounamentId,
    reducers: {
        updateOne: (state, action: PayloadAction<{tournamentId: number, data: NihusGrant}>) => {
            const {tournamentId, data} = action.payload
            state[tournamentId] = {
                ...(state[tournamentId] ?? {}),
                [data.id]: data,
            }
        },
        updateMany: (state, action: PayloadAction<{tournamentId: number, data: NihusGrantById}>) => {
            const {tournamentId, data} = action.payload
            state[tournamentId] = {
                ...(state[tournamentId] ?? {}),
                ...data,
            }
        },
    },
})

export default nihusGrants
