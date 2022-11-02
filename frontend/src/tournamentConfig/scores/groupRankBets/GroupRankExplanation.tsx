import React from 'react';


function GroupRankExplanation(){
	return (
		<div className='LigaBet-GroupRankBetConfig LB-ScoreConfigSection'>
            <ul>
                <li>
                    <b>פגיעה מושלמת</b> = דירוג מקומות 1-4 בבית לפי הסדר המדויק בו סיימו את שלב הבתים
                </li>
                <li>
                    <b>טעות מינימלית</b> = היפוך בין מקומות צמודים (טעות אחת בין מקומות 1,2 או 2,3 או 3,4)
                </li>
            </ul>
		</div>
	);
}


export default GroupRankExplanation;