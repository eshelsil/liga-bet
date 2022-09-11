import React, { ReactNode, useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { isUtlConfirmed } from '../utils';

import { fetchAndStoreUtls } from '../_actions/tournamentUser';
import { CurrentTournamentUser, NoSelector } from '../_selectors';
import ChooseYourUtl from './ChooseYourUtl';
import NoConfirmationView from './NoConfirmationView';


interface Props {
    fetchAndStoreUtls: () => Promise<void>,
    children: ReactNode,
}

function TournamentUserController({
    fetchAndStoreUtls,
    children,
}: Props){


    useEffect( ()=>{
        fetchAndStoreUtls()
        .catch(e => {
            console.log('FAILED to get tournament-user', e)
        });
    }, []);

    const currentUtl = useSelector(CurrentTournamentUser);
    const hasTournamentUser = !!currentUtl;
    const utlConfirmed = hasTournamentUser && isUtlConfirmed(currentUtl)

    return <>
        {hasTournamentUser && (
            utlConfirmed
                ? children
                : <NoConfirmationView currentUTL={currentUtl} />
        )}
        {!hasTournamentUser && (
            <ChooseYourUtl />
        )}

    </>
}

const mapDispatchToProps = {
    fetchAndStoreUtls,
}


export default connect(NoSelector, mapDispatchToProps)(TournamentUserController);