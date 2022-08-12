import { isObject } from "lodash";
import React from "react";
import { QuestionBetWithRelations, SpecialQuestionAnswer } from "../../types";
import TeamWithFlag from '../../widgets/TeamWithFlag';


interface SpecialQuestionAnswerProps {
    // specialQuestionType: SpecialQuestionType,
    answer: SpecialQuestionAnswer,
}

function SpecialQuestionAnswer({
    answer,
}: SpecialQuestionAnswerProps){
    if (!isObject(answer)){
        return answer;
    }
    const {name, crest_url} = answer;
    return <TeamWithFlag name={name} crest_url={crest_url}/>
    // switch (specialQuestionType){
    //     case 1: // winner
    //     case 5: // offensive_team
    //     case 4: // top scorer
    //         const {name, crest_url} = answer;
    //     case 2: // mvp
    //         return answer;
    //     default:
    //         return null;
    // }
}


interface Props {
    questionBet: QuestionBetWithRelations,
}

function QuestionBetScore({
    questionBet
}: Props){
    const { score, answer, relatedQuestion } = questionBet;
    const { name, answer: finalAnswer } = relatedQuestion;
    return <li className="list-group-item row flex-row col-no-padding" style={{paddingRight: "10px"}}>
        <div className="col-xs-1 pull-right col-no-padding">{score}</div>
        <div className="col-xs-3 pull-right col-no-padding">{name}</div>
        <div className="col-xs-4 pull-right col-no-padding">
            <SpecialQuestionAnswer answer={answer as any} />
        </div>
        <div className="col-xs-4 pull-right col-no-padding">
            <div>
                <SpecialQuestionAnswer answer={finalAnswer as any} />
            </div>
        </div>
    </li>
}

export default QuestionBetScore;