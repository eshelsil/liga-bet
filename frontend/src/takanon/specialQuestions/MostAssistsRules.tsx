import React from 'react';


interface Props {
    score: number;
}

function MostAssistsRules({
    score,
}: Props) {
    return (<>
        <h5 className="underlined">מלך בישולים</h5>
        <h5>{score} נקודות</h5>
        <ul style={{marginTop: 8}}>
            <li>במקרה של תיקו - כל הימור על אחד מהשחקנים יזכה את המהמר במלוא {score} הנקודות</li>
        </ul>
    </>);
};

export default MostAssistsRules;