import { AppDispatch } from '../_helpers/store'
import appCrucialLoaders from '../_reducers/appCrucialLoaders'

function updateIsLoadingAppCrucial(name: string, isLoading: boolean) {
    return (dispatch: AppDispatch) => {
        dispatch(appCrucialLoaders.actions.set({name, isLoading}))
    }
}

export { updateIsLoadingAppCrucial }
