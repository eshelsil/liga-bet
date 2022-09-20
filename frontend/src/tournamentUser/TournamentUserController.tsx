import React, { ReactNode, useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { Redirect } from 'react-router';
import { isUtlConfirmed } from '../utils';
import { fetchAndStoreUtls } from '../_actions/tournamentUser';
import { CurrentTournamentUser, NoSelector } from '../_selectors';
import ChooseYourUtl from './ChooseYourUtl';
import UserPage from '../myUser';
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
        <Switch>
            <Route path='/user' component={UserPage} />
            {hasTournamentUser && (
                utlConfirmed
                    ? children
                    : <NoConfirmationView currentUTL={currentUtl} />
            )}
            {!hasTournamentUser && (<>
                <Route path='/choose-tournament' component={ChooseYourUtl} />
                <Route path='/'>
                    <Redirect to='/choose-tournament' />
                </Route>
            </>)}
        </Switch>
    </>
}

const mapDispatchToProps = {
    fetchAndStoreUtls,
}


export default connect(NoSelector, mapDispatchToProps)(TournamentUserController);