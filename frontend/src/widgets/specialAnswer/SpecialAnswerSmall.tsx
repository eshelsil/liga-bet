import React from 'react'
import {
    Player,
    SpecialAnswerType,
    SpecialQuestionAnswer,
    SpecialQuestionType,
} from '../../types'
import { specialQuestionToAnswerType } from '../../utils'
import PlayerWithImg from '../Player'
import TeamWithFlag from '../TeamFlag/TeamWithFlag'
import './SpecialAnswerSmall.scss'

interface Props {
    answer?: SpecialQuestionAnswer
    type: SpecialQuestionType
}

function SpecialAnswerSmall({ answer, type }: Props) {
    const isTeamQuestion =
        specialQuestionToAnswerType[type] === SpecialAnswerType.Team
    const isPlayerQuestion =
        specialQuestionToAnswerType[type] === SpecialAnswerType.Player

    if (!answer) {
        return null
    }
    return (
        <div className={'LB-SpecialAnswerSmall'}>
            {isTeamQuestion && <TeamWithFlag name={answer?.name} size={36} />}
            {isPlayerQuestion && <PlayerWithImg player={answer as Player} size={36} />}
        </div>
    )
}

export default SpecialAnswerSmall
