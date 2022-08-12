import React from 'react';


function QuestionTab({
    name,
    id,
}:{
    name: string,
    id: number,
}){
    return (
        <li className="float-right ">
            <a data-toggle="tab" href={`#special-bet-wrapper-${id}`}>
                {name}
            </a>
        </li>
    );
}

export default QuestionTab;