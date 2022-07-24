import React, { useEffect } from 'react';
import { connect } from 'react-redux'

import {fetch_current_tournament_user} from '../_actions/tournamentUser';
import {TournamentUserControllerSelector} from '../_selectors/main';
  

function TournamentUserController({
    fetch_current_tournament_user,
    tournamentUser,
    children,
}){


    useEffect( ()=>{
        fetch_current_tournament_user()
        .catch(e => {
            console.log('FAILED to get tournament-user', e)
        });
    }, []);

    const hasTournamentUser = tournamentUser?.id !== undefined;

    return <>
        {hasTournamentUser && (
            <>
                {children}
            </>
        )}
        {!hasTournamentUser && (
            // Tournament selection will be displayed here?
            <div>
                Loading tournaments...
            </div>
        )}

    </>
}

const mapDispatchToProps = {
    fetch_current_tournament_user,
}


export default connect(TournamentUserControllerSelector, mapDispatchToProps)(TournamentUserController);