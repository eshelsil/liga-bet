import React, { useEffect } from 'react';
import { connect } from 'react-redux'

import {fetchAndStoreCurrentTournamentUser} from '../_actions/tournamentUser.ts';
import {TournamentUserControllerSelector} from '../_selectors';
  

function TournamentUserController({
    fetchAndStoreCurrentTournamentUser,
    tournamentUser,
    children,
}){


    useEffect( ()=>{
        fetchAndStoreCurrentTournamentUser()
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
    fetchAndStoreCurrentTournamentUser,
}


export default connect(TournamentUserControllerSelector, mapDispatchToProps)(TournamentUserController);