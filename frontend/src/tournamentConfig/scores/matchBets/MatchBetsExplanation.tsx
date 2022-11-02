import React from 'react';


function MatchBetsExplanation(){
	return (
		<div className='LigaBet-MatchBetsExplanation LB-ScoreConfigSection'>
            <ul>
                <li>
                    ניתן לקבוע את הניקוד שמתקבל עבור כל משחק בשלב הבתים והנוקאווט
                </li>
                <li>
                    ראשית יחושב הימור ה 1X2 על תוצאת המשחק (90 דק')
                </li>
                <li>
                    לאחר מכן ינתן בונוס על פגיעה בתוצאה מדוייקת (90 דק')
                </li>
                <li>
                    בשלבי הנוקאאוט ניתן להוסיף בונוס על קביעת המעפילה לשלב הבא
                </li>
                <li>
                    ניתן להוסיף בונוס נוסף למשחקי החצי גמר והגמר
                </li>
            </ul>
		</div>
	);
}


export default MatchBetsExplanation;