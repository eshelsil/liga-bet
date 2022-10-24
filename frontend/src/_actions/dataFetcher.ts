import { CollectionName } from '../types/dataFetcher'
import dataFetcher from '../_reducers/dataFetcher'

function fetchCollection(name: CollectionName) {
    return dataFetcher.actions.fetch({collection: name})
}

function resolveCollectionFetch(name: CollectionName) {
    return dataFetcher.actions.resolve({collection: name})
}

function rejectCollectionFetch(name: CollectionName, error: string) {
    return dataFetcher.actions.reject({collection: name, error})
}

export {
    fetchCollection,
    resolveCollectionFetch,
    rejectCollectionFetch,
}
