import React, { useEffect } from 'react';
import { connect } from 'react-redux'

import {fetchAndStoreUtls} from '../_actions/tournamentUser.ts';
import {TournamentUserControllerSelector} from '../_selectors/tournaments.ts';
  

function TournamentUserController({
    fetchAndStoreUtls,
    hasTournamentUser,
    children,
}){


    useEffect( ()=>{
        fetchAndStoreUtls()
        .catch(e => {
            console.log('FAILED to get tournament-user', e)
        });
    }, []);


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
    fetchAndStoreUtls,
}


export default connect(TournamentUserControllerSelector, mapDispatchToProps)(TournamentUserController);