import React from "react";
import TeamWithFlag from '../../widgets/TeamWithFlag.tsx';


function SpecialQuestionAnswer(specialQuestionType, answer){
    switch (specialQuestionType){
        case 1: // winner
        case 5: // offensive_team
        case 4: // top scorer
            const {name, crest_url} = answer;
            return <TeamWithFlag name={name} crest_url={crest_url}/>
        case 2: // mvp
            return answer;
        default:
            return null;
    }
}


function QuestionBetScore({
    questionBet
}){
    const { id, score, answer, relatedQuestion } = questionBet;
    const {id: questionId, name, answer: finalAnswer} = relatedQuestion;
    return <li className="list-group-item row flex-row col-no-padding" style={{paddingRight: "10px"}}>
        <div className="col-xs-1 pull-right col-no-padding">{score}</div>
        <div className="col-xs-3 pull-right col-no-padding">{name}</div>
        <div className="col-xs-4 pull-right col-no-padding">{SpecialQuestionAnswer(questionId, answer)}</div>
        <div className="col-xs-4 pull-right col-no-padding">
            <div>
                <SpecialQuestionAnswer {...{questionId, finalAnswer}} />
            </div>
        </div>
    </li>
}

export default QuestionBetScore;