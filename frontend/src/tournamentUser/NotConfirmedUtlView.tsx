import React from 'react';
import { UtlWithTournament } from '../types';



interface Props {
    currentUTL: UtlWithTournament,
}

function NotConfirmedUtlView({
    currentUTL,
}: Props){
    const { tournament } = currentUTL;
    const { name: tournamentName } = tournament;
    return  (
        <div>
            <h2>תיכף זה מתחיל...</h2>
            <h4 style={{marginTop: 24}}>
                נרשמת לטורניר "
                {tournamentName}
                "
            </h4>
            <h4>
                ברגע שמנהלי הטורניר יאשרו אותך, תוכל להתחיל לשחק
            </h4>
        </div>
    );
}


export default NotConfirmedUtlView;