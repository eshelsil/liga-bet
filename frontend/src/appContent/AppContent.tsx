import React, { lazy } from 'react';
import InitialDataFetcher from '../initialDataFetcher/InitialDataFetcher';
import TournamentUserController from '../controllers/TournamentUserController';
import { CrucialLoader } from '../types';
import SuspenseWithLoader from '../_helpers/SuspenseWithLoader';

const AppBasicRoutes = lazy(() => import('./AppBasicRoutes'));


function AppContent() {
    return (
        <InitialDataFetcher>
            <TournamentUserController>
                <SuspenseWithLoader name={CrucialLoader.BasicRoutes}>
                    <AppBasicRoutes />
                </SuspenseWithLoader>
            </TournamentUserController>
        </InitialDataFetcher>
    )
}

export default AppContent
