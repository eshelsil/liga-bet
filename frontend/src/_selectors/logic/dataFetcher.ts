import { createSelector } from 'reselect'
import { initialDataCollections } from '../../utils'
import { CurrentGameBetsFetcher, CurrentTournamentUserId, DataFetcher } from '../base'


export const HasFetchedAllTournamentInitialData = createSelector(
    DataFetcher,
    CurrentGameBetsFetcher,
    CurrentTournamentUserId,
    (dataFetcher, gameBetsFetcher, utlId) => {
        for (const collectionName of initialDataCollections){
            const { loading, initialized } = dataFetcher[collectionName]
            if (loading || !initialized){
                return false
            }
        }
        if (!gameBetsFetcher.users.fetched.includes(utlId)) {
            return false
        }
        return true
    }
)