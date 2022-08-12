import React from 'react';
import TeamWithFlag from '../widgets/TeamWithFlag';


function QuestionBetRow({
    name,
    crest_url,
    gumblers,
}: {
    name: string,
    crest_url: string,
    gumblers: string[],
} ){

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


export default QuestionBetRow;