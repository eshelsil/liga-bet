import React from 'react';


interface Props {
    score: number;
}

function OffensiveTeamRules({
    score,
}: Props) {
    return (<>
        <h5 className="underlined">ההתקפה החזקה בבתים</h5>
        <h5>{score} נקודות</h5>
        <h5>הקבוצה שהבקיעה הכי הרבה שערים בבתים</h5>
        <ul style={{marginTop: 8}}>
            <li>במקרה של תיקו - כל הימור על אחת מהקבוצות יזכה את המהמר במלוא הנקודות</li>
        </ul>
    </>);
};

export default OffensiveTeamRules;