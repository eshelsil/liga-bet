import React from 'react'
import { SpecialQuestionAnswer, SpecialQuestionType } from '../types'
import SpecialAnswer from '../widgets/specialAnswer/SpecialAnswer'

function QuestionBetRow({
    answer,
    type,
    gumblers,
}: {
    answer: SpecialQuestionAnswer
    type: SpecialQuestionType
    gumblers: string[]
}) {
    return (
        <li className="list-group-item row full-row">
            <div className="col-xs-5 pull-right">
                <SpecialAnswer {...{ answer, type }} />
            </div>
            <div className="col-xs-5 pull-right">
                {gumblers.map((name) => (
                    <div key={name}>{name}</div>
                ))}
            </div>
        </li>
    )
}

export default QuestionBetRow
