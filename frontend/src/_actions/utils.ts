import { isEmpty } from 'lodash'
import { AsyncAction } from '../types'
import { CollectionName } from '../types/dataFetcher'
import { AppDispatch, GetRootState, RootState } from '../_helpers/store'
import { DataFetcher } from '../_selectors'
import { fetchCollection, rejectCollectionFetch, resolveCollectionFetch } from './dataFetcher'

export function generateInitCollectionAction({
    collectionName,
    selector,
    fetchAction,
    shouldFetchSelector,
}: {
    collectionName: CollectionName
    selector: (state: RootState) => object
    fetchAction: () => AsyncAction
    shouldFetchSelector?: (state: RootState) => boolean
}) {
    return () => {
        return async (dispatch: AppDispatch, getState: GetRootState) => {
            const models = selector(getState())
            const hasData = !isEmpty(models)
            const { error } = DataFetcher(getState())[collectionName];
            const dontFetch = shouldFetchSelector && !shouldFetchSelector(getState())
            if (dontFetch || hasData || !!error) {
                return;
            }
            dispatch(fetchCollection(collectionName))
            dispatch(fetchAction())
                .then(() => dispatch(resolveCollectionFetch(collectionName)))
                .catch(
                    (error) => dispatch(
                        rejectCollectionFetch(
                            collectionName,
                            error?.responseJSON?.message ?? JSON.stringify(error)
                        )
                    )
                )
        }
    }
}