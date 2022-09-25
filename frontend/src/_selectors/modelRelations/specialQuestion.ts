import { mapValues } from 'lodash';
import { createSelector } from 'reselect'
import { PlayersById, SpecialAnswerType, SpecialQuestionAnswer, SpecialQuestionsById, TeamsById } from '../../types';
import { specialQuestionToAnswerType } from '../../utils';
import { SpecialQuestionsFormatted, Teams } from '../base';
import { PlayersWithTeams } from './players';


export function getSpecialAnswerModel(answer: number, type: SpecialAnswerType, teamsById: TeamsById, playersById: PlayersById){
    if (!answer){
        return null;
    }
    let answerModel: SpecialQuestionAnswer;
    if (type === SpecialAnswerType.Team){
        answerModel = teamsById[answer];
    } else if (type === SpecialAnswerType.Player){
        answerModel = playersById[answer];
    }
    return answerModel ?? null;
}

export const SpecialQuestionsWithRelations = createSelector(
    SpecialQuestionsFormatted,
    Teams,
    PlayersWithTeams,
    (questions, teams, players): SpecialQuestionsById => {
        return mapValues(questions, question => {
            const { type } = question;
            return {
                ...question,
                answer: question.answer.map(
                    answer => getSpecialAnswerModel(answer, specialQuestionToAnswerType[type], teams, players)
                ),
            }
        });
    }
);