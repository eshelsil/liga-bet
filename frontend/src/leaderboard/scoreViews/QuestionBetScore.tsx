import React from "react";
import { QuestionBetWithRelations } from "../../types";
import SpecialAnswer from "../../widgets/specialAnswer/SpecialAnswer";


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
            <SpecialAnswer answer={answer} type={questionType} />
        </div>
        <div className="col-xs-4 pull-right col-no-padding">
            <div>
                {finalAnswers.map(finalAnswer => (
                    <SpecialAnswer key={finalAnswer.id} answer={finalAnswer} type={questionType} />
                ))}
            </div>
        </div>
    </li>
}

export default QuestionBetScore;