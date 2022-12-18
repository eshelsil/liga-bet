import { createSelector } from 'reselect'
import { IsMvpBetOn, MvpSpecialQuestion } from '../base'
import { IsCompetitionDone } from '../modelRelations'

export const IsMissingMvpAnswer = createSelector(
    IsMvpBetOn,
    MvpSpecialQuestion,
    (isMvpBetOn, mvpQuestion) => {
        if (!isMvpBetOn){
            return false
        }
        if (mvpQuestion?.answer){
            return false
        }
        return true
    }
)

export const IsWaitingForMissingMvpAnswer = createSelector(
    IsMissingMvpAnswer,
    IsCompetitionDone,
    (isMissing, isCompetitionDone) => isCompetitionDone && isMissing
)