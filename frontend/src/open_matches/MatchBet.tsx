import moment from 'moment';
import React, { useState } from 'react';
import { MatchWithABet } from '../types';
import EditMatchBet from './editBet';
import MatchWithBetView from './matchView';


function MatchBet ({
    match,
    sendBet,
}: {
    match: MatchWithABet,
    sendBet: (...args: any) => Promise<void>
}){
    const {id, is_knockout} = match;
    const [edit, setEdit] = useState(false);

    const goToEditMode = () => setEdit(true);
    const cancelEditMode = () => setEdit(false);
    const saveBet = ({
        homeScore,
        awayScore,
        koWinner,
    }) => {
        sendBet({
            matchId: id,
            is_knockout,
            homeScore,
            awayScore,
            koWinner,
        })
        .then(()=>{
            cancelEditMode();
        });
    }
    return (<>
        {edit && (
            <EditMatchBet
                match={match}
                onCancel={cancelEditMode}
                onSave={saveBet}
            />
        )}
        {!edit && (
            <MatchWithBetView
                match={match}
                onEdit={goToEditMode}
            />
        )}
    </>
    );
}

export default MatchBet;