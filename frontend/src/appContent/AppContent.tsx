import React, { lazy } from 'react';
import TournamentUserController from '../controllers/TournamentUserController';
import { CrucialLoader } from '../types';
import SuspenseWithLoader from '../_helpers/SuspenseWithLoader';

const AppBasicRoutes = lazy(() => import('./AppBasicRoutes'));


function AppContent() {
    return (
        <TournamentUserController>
            <SuspenseWithLoader name={CrucialLoader.BasicRoutes}>
                <AppBasicRoutes />
            </SuspenseWithLoader>
        </TournamentUserController>
    )
}

export default AppContent
