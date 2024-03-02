import { createSelector } from 'reselect'
import { DialogName } from '../dialogs/types'
import { Dialogs } from './base'

export const IsOpenDialogChangePassword = createSelector(
    Dialogs,
    (dialogs) => !!dialogs[DialogName.ChangePassword]
)

export const IsOpenMultiBetExplanationDialog = createSelector(
    Dialogs,
    (dialogs) => !!dialogs[DialogName.MultiBetExplanation]
)

export const IsOpenWaitForMvpDialog = createSelector(
    Dialogs,
    (dialogs) => !!dialogs[DialogName.WaitForMvp]
)

export const IsOpenGameScoreInfoDialog = createSelector(
    Dialogs,
    (dialogs) => !!dialogs[DialogName.GameScoreInfo]
)
