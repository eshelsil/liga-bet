import React from 'react'

function AutoBetExplanation() {
    return (
        <>
            <h3 className='LB-TitleText' style={{ marginBottom: 20 }}>ניחוש אוטומטי</h3>
            <div className="takanonTextSection">
                <p>
                    אם שכחת להגיש ניחוש למשחק עד תחילתו, המערכת תגיש ניחוש אוטומטי בשמך לאחר תחילת המשחק.
                </p>
                <p>
                    באפשרותך לבחור את אופן הניחוש האוטומטי במסך "ניחוש משחקים":
                </p>
                <ul>
                    <li>
                        <span style={{fontWeight: 700}}>0:0 (ברירת מחדל)</span> — יוגש ניחוש 0:0. במשחקי נוקאאוט שדורשים בחירת מעפילה, תיבחר מעפילה אקראית.
                    </li>
                    <li>
                        <span style={{fontWeight: 700}}>אקראי</span> — תוגרל תוצאת הימור אקראית, כולל בחירת מעפילה במשחקי נוקאאוט.
                    </li>
                </ul>
            </div>
        </>
    )
}

export default AutoBetExplanation
