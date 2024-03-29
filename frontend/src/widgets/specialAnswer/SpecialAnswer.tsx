import React from 'react'
import {
    Player,
    SpecialAnswerType,
    SpecialQuestionAnswer,
    SpecialQuestionType,
    Team,
} from '../../types'
import { specialQuestionToAnswerType } from '../../utils'
import PlayerAnswerView from './PlayerAnswerView'
import TeamAnswerView from './TeamAnswerView'
import './SpecialAnswer.scss'

interface Props {
    type: SpecialQuestionType
    answer?: SpecialQuestionAnswer
    isVertical?: boolean
}

function SpecialAnswer({ answer, type, isVertical }: Props) {
    const isTeamQuestion =
        specialQuestionToAnswerType[type] === SpecialAnswerType.Team
    const isPlayerQuestion =
        specialQuestionToAnswerType[type] === SpecialAnswerType.Player

    if (!answer) {
        return null
    }
    return (
        <div className={`LigaBet-SpecialAnswer ${isVertical ? 'SpecialAnswer-vertical' : ''}`}>
            {isTeamQuestion && <TeamAnswerView team={answer as Team} />}
            {isPlayerQuestion && <PlayerAnswerView player={answer as Player} />}
        </div>
    )
}

export default SpecialAnswer
