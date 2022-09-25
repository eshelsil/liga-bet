import React from "react";
import { QuestionBetWithRelations, SpecialQuestionAnswer, SpecialQuestionType } from "../../types";
import { getSpecialAnswerAttributes } from "../../utils";
import TeamWithFlag from '../../widgets/TeamWithFlag';


interface AnswerAttributes {
    questionType: SpecialQuestionType,
    answer: SpecialQuestionAnswer,
}

interface SpecialQuestionAnswerProps extends AnswerAttributes {
}




function SpecialQuestionAnswer({
    answer,
    questionType,
}: SpecialQuestionAnswerProps){
    const {name, crest_url} = getSpecialAnswerAttributes({
        answer,
        questionType,
    });
    if (!(name && crest_url)){
        return null;
    }
    return (
        <TeamWithFlag name={name} crest_url={crest_url} />
    )
}


interface Props {
    questionBet: QuestionBetWithRelations,
}

function QuestionBetScore({
    questionBet
}: Props){
    const { score, answer, relatedQuestion } = questionBet;
    const { name, type: questionType, answer: finalAnswers } = relatedQuestion;
    return <li className="list-group-item row flex-row col-no-padding" style={{paddingRight: "10px"}}>
        <div className="col-xs-1 pull-right col-no-padding">{score}</div>
        <div className="col-xs-3 pull-right col-no-padding">{name}</div>
        <div className="col-xs-4 pull-right col-no-padding">
            <SpecialQuestionAnswer answer={answer} questionType={questionType} />
        </div>
        <div className="col-xs-4 pull-right col-no-padding">
            <div>
                {finalAnswers.map(finalAnswer => (
                    <SpecialQuestionAnswer answer={finalAnswer} questionType={questionType} />
                ))}
            </div>
        </div>
    </li>
}

export default QuestionBetScore;