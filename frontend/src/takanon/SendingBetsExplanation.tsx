import React from 'react'

function MatchBetsExplanation() {
    return (
        <>
            <div className="takanonTextSection">
                <h4>ניחוש משחקים</h4>
                <p>
                    כל ניחוש תוצאת משחק יהיה פתוח לעריכה עד לשעת תחילת המשחק.
                    <br />
                    כלל הניחושים נחשפים בתחילת המשחק וניתנים לצפייה בלשונית
                    "צפייה בניחושים".
                </p>
            </div>
        </>
    )
}

function PrimalBetsExplanation() {
    return (
        <>
            <div className="takanonTextSection">
                <h4>ניחושים מיוחדים ודירוגי בתים</h4>
                <p>
                    יש למלא את כלל הניחושים המיוחדים ואת דירוגי הבתים עד לשריקת
                    הפתיחה של המשחק הראשון בטורניר.
                    <br />
                    לא ניתן יהיה לערוך או לשנות ניחושים אלה במהלך הטורניר.
                </p>
            </div>
        </>
    )
}

function SendingBetsExplanation() {
    return (
        <>
            <h3 style={{ marginBottom: 20 }}>שליחת ניחושים</h3>
            <MatchBetsExplanation />
            <PrimalBetsExplanation />
        </>
    )
}

export default SendingBetsExplanation
