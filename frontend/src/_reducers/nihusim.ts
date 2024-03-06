import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Nihus, NihusById } from '../types'


type NihusimByTournamentId = Record<number, NihusById>
type State = NihusimByTournamentId

const nihusim = createSlice({
    name: 'nihusim',
    initialState: {} as State,
    reducers: {
        updateOne: (state, action: PayloadAction<{tournamentId: number, nihus: Nihus}>) => {
            const {tournamentId, nihus} = action.payload;
            state[tournamentId] = {
                ...state[tournamentId],
                [nihus.id]: nihus,
            };
        },
        updateMany: (state, action: PayloadAction<{tournamentId: number, nihusim: NihusById}>) => {
            const {tournamentId, nihusim} = action.payload;
            state[tournamentId] = {
                ...state[tournamentId],
                ...nihusim,
            };
        }
    },
})

export default nihusim
