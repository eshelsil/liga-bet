import { createSelector } from 'reselect'
import { IsMvpBetOn, MvpSpecialQuestion } from '../base'
import { IsCompetitionDone } from '../modelRelations'

export const IsMissingMvpBet = createSelector(
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
    IsMissingMvpBet,
    IsCompetitionDone,
    (isMissing, isCompetitionDone) => isCompetitionDone && isMissing
)