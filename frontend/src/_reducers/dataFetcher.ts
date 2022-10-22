import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { getAllEnumValues } from '../utils'
import { keyBy } from 'lodash'
import { CollectionName, CollectionFetcherData } from '../types/dataFetcher'


type State = Record<CollectionName, CollectionFetcherData>

interface ActionPayload {
    collection: string,
}

interface RejectPayload extends ActionPayload {
    error: string
}

const collections = getAllEnumValues(CollectionName)
const initialState = keyBy(
    collections.map(
        collection => ({
            name: collection,
            initialized: false,
            loading: false,
            error: null,
        })
    ),
    'name'
) as State;


const dataFetcher = createSlice({
    name: 'dataFetcher',
    initialState,
    reducers: {
        fetch: (state, action: PayloadAction<ActionPayload>) => {
            const collectionName = action.payload.collection
            state[collectionName].initialized = true
            state[collectionName].loading = true
            state[collectionName].error = null
        },
        resolve: (state, action: PayloadAction<ActionPayload>) => {
            const collectionName = action.payload.collection
            state[collectionName].loading = false
            state[collectionName].error = null
        },
        reject: (state, action: PayloadAction<RejectPayload>) => {
            const collectionName = action.payload.collection
            state[collectionName].loading = false
            state[collectionName].error = action.payload.error
        },
    },
})

export default dataFetcher
