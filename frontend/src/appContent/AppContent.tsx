import React, { lazy } from 'react';
import TournamentUserController from '../controllers/TournamentUserController';
import SuspenseWithLoader from '../_helpers/SuspenseWithLoader';

const AppBasicRoutes = lazy(() => import('./AppBasicRoutes'));


function AppContent() {
    return (
        <TournamentUserController>
            <SuspenseWithLoader name='basic-routes'>
                <AppBasicRoutes />
            </SuspenseWithLoader>
        </TournamentUserController>
    )
}

export default AppContent
