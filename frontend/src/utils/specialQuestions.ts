import {
    NameWithFlagAttrs,
    Player,
    SpecialAnswerType,
    SpecialQuestionAnswer,
    SpecialQuestionBase,
    SpecialQuestionType,
    Team,
} from '../types'

export const specialQuestionToAnswerType: Record<
    SpecialQuestionType,
    SpecialAnswerType
> = {
    [SpecialQuestionType.Winner]: SpecialAnswerType.Team,
    [SpecialQuestionType.RunnerUp]: SpecialAnswerType.Team,
    [SpecialQuestionType.OffensiveTeamGroupStage]: SpecialAnswerType.Team,
    [SpecialQuestionType.TopScorer]: SpecialAnswerType.Player,
    [SpecialQuestionType.TopAssists]: SpecialAnswerType.Player,
    [SpecialQuestionType.MVP]: SpecialAnswerType.Player,
}

export const specialQuestionToHebrew: Record<SpecialQuestionType, string> = {
    [SpecialQuestionType.Winner]: 'זוכה',
    [SpecialQuestionType.RunnerUp]: 'סגנית',
    [SpecialQuestionType.OffensiveTeamGroupStage]: 'ההתקפה החזקה בבתים',
    [SpecialQuestionType.TopScorer]: 'מלך השערים',
    [SpecialQuestionType.TopAssists]: 'מלך הבישולים',
    [SpecialQuestionType.MVP]: 'מצטיין הטורניר',
}

export function getSpecialQuestionName(specialQuestion: SpecialQuestionBase) {
    return specialQuestionToHebrew[specialQuestion.type]
}

export function hasTeamAnswer(specialQuestion: SpecialQuestionBase) {
    return (
        specialQuestionToAnswerType[specialQuestion.type] ===
        SpecialAnswerType.Team
    )
}

export function hasPlayerAnswer(specialQuestion: SpecialQuestionBase) {
    return (
        specialQuestionToAnswerType[specialQuestion.type] ===
        SpecialAnswerType.Player
    )
}

export function getSpecialAnswerAttributes({
    answer,
    questionType,
}: {
    answer: SpecialQuestionAnswer
    questionType: SpecialQuestionType
}): NameWithFlagAttrs {
    const answerType = specialQuestionToAnswerType[questionType]
    const empty = {
        name: null,
        crest_url: null,
    }
    if (!answer) {
        return empty
    }
    if (answerType === SpecialAnswerType.Team) {
        const { name, crest_url } = answer as Team
        return { name, crest_url }
    }
    if (answerType === SpecialAnswerType.Player) {
        const { name, team } = answer as Player
        const { crest_url } = team
        return { name, crest_url }
    }
    return empty
}
