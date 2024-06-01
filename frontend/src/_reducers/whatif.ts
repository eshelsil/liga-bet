import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { WinnerSide } from '../types'

export enum ScrorerType {
    GOAL = 'goal',
    ASSIST = 'assist',
}

export type UpdateWhatifResultPayload = {
    gameId: number
    result: WhatifResult
}
export type UpdateWhatifBetterPayload = UpdateWhatifResultPayload & {
    utlId: number
}

export type UpdateWhatifScorerPayload = {
    gameId: number
    playerId: number
    amount: number
    type: ScrorerType
}

export type WhatifResult = {
    home?: number
    away?: number
    qualifier?: WinnerSide
}
type WhatifBetsByUtl = Record<number, WhatifResult>
type GoalsCountByPlayerId = Record<number, number>

type WhatifGame = {
    id: number
    result: WhatifResult
    betters: WhatifBetsByUtl
    scorers: GoalsCountByPlayerId
    assists: GoalsCountByPlayerId
}

export type WhatifGamesData = Record<number, WhatifGame>

type State = {
    isOn: boolean
    games: WhatifGamesData
}

const getEmptyGameData = (gameId: number): WhatifGame => ({
    id: gameId,
    result: {},
    betters: {},
    scorers: {},
    assists: {},
})

const whatifSlice = createSlice({
    name: 'whatif',
    initialState: { isOn: false, games: {} } as State,
    reducers: {
        updateResult: (
            state,
            action: PayloadAction<UpdateWhatifResultPayload>
        ) => {
            const { result, gameId } = action.payload
            if (!state.games[gameId]) {
                state.games[gameId] = getEmptyGameData(gameId)
            }
            state.games[gameId].result = result
        },
        updateBetter: (
            state,
            action: PayloadAction<UpdateWhatifBetterPayload>
        ) => {
            const { result, utlId, gameId } = action.payload
            if (!state.games[gameId]) {
                state.games[gameId] = getEmptyGameData(gameId)
            }
            state.games[gameId].betters[utlId] = result
        },
        updateScorer: (
            state,
            action: PayloadAction<UpdateWhatifScorerPayload>
        ) => {
            const { playerId, amount, type, gameId } = action.payload
            if (!state.games[gameId]) {
                state.games[gameId] = getEmptyGameData(gameId)
            }
            const slice =
                state.games[gameId][
                    type === ScrorerType.GOAL ? 'scorers' : 'assists'
                ]
            if (amount == -Infinity) {
                delete slice[playerId]
            } else {
                slice[playerId] = amount
            }
        },
        setIsON: (state, action: PayloadAction<boolean>) => {
            const isOn = action.payload
            state.isOn = isOn
        },
    },
})

export default whatifSlice
