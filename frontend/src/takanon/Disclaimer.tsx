import React from 'react';
import { useSelector } from 'react-redux';
import { CurrentTournamentOwner } from '../_selectors';


function Disclaimer() {
    const owner = useSelector(CurrentTournamentOwner)
    return (<>
        <h4 style={{marginTop: 4}}>הצהרות</h4>
        <ul>
            <li>
                התקנון נקבע על ידי מנהל הטורניר (המכונה אצליכם בחבר'ה "{owner?.name}"), ואין למנהלי האתר אחריות על הפרסים או על שיטת חלוקת הנקודות
            </li>
        </ul>
    </>);
};

export default Disclaimer;