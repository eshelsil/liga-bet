import { groupBy } from 'lodash';
import React from 'react';
import { QuestionBetWithRelations, Team } from '../types';
import { getSpecialAnswerAttributes } from '../utils';
import QuestionBetRow from './QuestionBetRow';

interface QuestionWithAnswerRelation extends QuestionBetWithRelations {
    answerModel?: Team,
}

function QuestionBetsList({
    name,
    id,
    bets: betsOriginal,
}: {
    name: string,
    id: number,
    bets: QuestionBetWithRelations[]
}){
    const bets = betsOriginal as QuestionWithAnswerRelation[];
    const betsByAnswer = groupBy(bets, bet => bet.answer.id);
    return (
        <div id={`special-bet-wrapper-${id}`} className="tab-pane fade" style={{padding: 10}}>
            <h3 className="text-center">{name}</h3>
            <div style={{paddingTop: 35}}>
                <ul className="list-group" style={{paddingRight: 0}}>
                    <li className="list-group-item row full-row" style={{background: '#d2d2d2'}}>
                        <div className="col-xs-5 pull-right">הימור</div>
                        <div className="col-xs-5 pull-right">מהמרים</div>
                    </li>
                    {Object.values(betsByAnswer).map(bets =>{
                        const answer = bets[0].answer;
                        const questionType = bets[0].relatedQuestion.type;
                        const { id } = answer;
                        const {name, crest_url} = getSpecialAnswerAttributes({answer, questionType});
                        const gumblers = bets.map(bet => bet.utlName);
                        return <QuestionBetRow key={id} name={name} crest_url={crest_url} gumblers={gumblers} />
                    })}
                </ul>
            </div>
        </div>
    );
}

export default QuestionBetsList;