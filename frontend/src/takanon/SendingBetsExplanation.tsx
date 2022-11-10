import React from 'react'

function MatchBetsExplanation() {
    return (
        <>
            <div className="text-part">
                <h4>הימורי משחקים</h4>
                <p>
                    כל משחק פתוח להימור עד לשעת תחילת המשחק.
                    <br />
                    כלל ההימורים נחשפים בתחילת המשחק וניתנים לצפייה בלשונית
                    "צפייה בהימורים".
                </p>
            </div>
        </>
    )
}

function PrimalBetsExplanation() {
    return (
        <>
            <div className="text-part">
                <h4>הימורים מיוחדים והימורי בתים</h4>
                <p>
                    יש למלא את כלל ההימורים המיוחדים והימורי הבתים עד לשריקת
                    הפתיחה של המשחק הראשון בטורניר.
                    <br />
                    לא ניתן יהיה לערוך או לשנות את ההימורים במהלך הטורניר.
                </p>
            </div>
        </>
    )
}

function SendingBetsExplanation() {
    return (
        <>
            <h3 style={{ marginBottom: 20 }}>שליחת הימורים</h3>
            <MatchBetsExplanation />
            <PrimalBetsExplanation />
        </>
    )
}

export default SendingBetsExplanation
