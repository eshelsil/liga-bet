import { mapValues } from 'lodash'
import { createSelector } from 'reselect'
import { WinnerSpecialQuestionId } from '../base'
import {
    QuestionBetsByUtlId,
} from '../modelRelations'

export const WinnerBetByUtlId = createSelector(
    QuestionBetsByUtlId,
    WinnerSpecialQuestionId,
    (questionBetsByUtlId, winnerQuestionId) => {
        return mapValues(questionBetsByUtlId,
            bets => bets.find(bet => bet.type_id === winnerQuestionId)
        )
    }
)