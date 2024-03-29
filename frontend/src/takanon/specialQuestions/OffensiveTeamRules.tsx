import React from 'react'

interface Props {
    score: number
}

function OffensiveTeamRules({ score }: Props) {
    return (
        <>
            <h5 className="underlined">ההתקפה החזקה בבתים</h5>
            <h5>הקבוצה שהבקיעה הכי הרבה שערים בשלב הבתים</h5>
            <h5>{score} נקודות</h5>
            <ul style={{ marginTop: 4 }}>
                <li>
                    במקרה של תיקו - כל ניחוש על אחת מהקבוצות יזכה את המנחש במלוא
                    הנקודות
                </li>
            </ul>
        </>
    )
}

export default OffensiveTeamRules
