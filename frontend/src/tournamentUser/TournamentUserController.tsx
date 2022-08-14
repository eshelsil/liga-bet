import React, { ReactNode, useEffect } from 'react';
import { connect } from 'react-redux';

import { fetchAndStoreUtls } from '../_actions/tournamentUser';
import { TournamentUserControllerSelector } from '../_selectors/tournaments';
import ChooseYourUtl from './ChooseYourUtl';


interface Props {
    fetchAndStoreUtls: () => Promise<void>,
    hasTournamentUser: boolean,
    children: ReactNode,
}

function TournamentUserController({
    fetchAndStoreUtls,
    hasTournamentUser,
    children,
}: Props){


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
            <ChooseYourUtl />
        )}

    </>
}

const mapDispatchToProps = {
    fetchAndStoreUtls,
}


export default connect(TournamentUserControllerSelector, mapDispatchToProps)(TournamentUserController);