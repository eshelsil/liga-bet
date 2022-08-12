import moment from 'moment';
import React, { useState } from 'react';
import EditMatchBet from './editBet';
import MatchWithBetView from './matchView';


function MatchBet ({
    match,
    sendBet,
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

const OpenMatchesView = ({
    matches = [],
    sendBet,
}) => {
    const hasMatches = matches.length > 0;
    return (
        <div>
            <h1>רשימת משחקים</h1>
            <span className="admin">{moment().format('HH:mm  YYYY/MM/DD')}</span>
            {!hasMatches && (
                <h3>אין משחקים פתוחים</h3>
            )}
            {hasMatches && (
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th className="admin">מזהה</th>
                        <th className="open-matches-date-header">
                            תאריך
                        </th>
                        <th>
                            משחק
                        </th>
                        <th className="open-matches-bet-header" style={{paddingLeft: 30}}>
                            הימור
                        </th>
                        <th>

                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {matches.map(match =>(
                        <MatchBet key={match.id} match={match} sendBet={sendBet} />
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default OpenMatchesView;