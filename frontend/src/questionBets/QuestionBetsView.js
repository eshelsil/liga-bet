import React from 'react';
import TeamWithFlag from '../widgets/TeamWithFlag';


function QuestionBetRow({
    name,
    crest_url,
    gumblers,
}){

    return (
    <li className="list-group-item row full-row">
        <div className="col-xs-5 pull-right">
            {crest_url && (
                <TeamWithFlag name={name} crest_url={crest_url} />
            )}
            {!crest_url && (
                name
            )}
        </div>
        <div className="col-xs-5 pull-right">
            {gumblers.map(
                (name) => <div key={name}>
                    {name}
                </div>
            )}
        </div>
    </li>
    )
}


function QuestionBetsList({
    name,
    id,
    bets,
}){
    const betsByAnswer = _.groupBy(bets, bet => bet.answer.id);
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
                        const {name, crest_url, id} = answer;
                        const gumblers = bets.map(bet => bet.user_name);
                        return <QuestionBetRow key={id} name={name} crest_url={crest_url} gumblers={gumblers} />
                    })}
                </ul>
            </div>
        </div>
    );
}


function QuestionTab({
    name,
    id,
}){
    return (
        <li className="float-right ">
            <a data-toggle="tab" href={`#special-bet-wrapper-${id}`}>
                {name}
            </a>
        </li>
    );
}


const QuestionBetsView = ({
    questions,
    betsByQuestionId
}) => {
    return (
        <div >
            <h1>הימורים מיוחדים</h1>
            <div className="float-right">
                <ul className="nav nav-tabs" style={{paddingRight: 0}}>
                    {Object.values(questions).map(question => (
                        <QuestionTab key={question.id} name={question.name} id={question.id}/>
                    ))}
                </ul>

                <div className="tab-content" style={{marginTop: 25}}>
                    {Object.values(questions).map((question, i) =>
                        <QuestionBetsList
                            key={question.id}
                            name={question.name}
                            id={question.id}
                            bets={betsByQuestionId[question.id]}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuestionBetsView;