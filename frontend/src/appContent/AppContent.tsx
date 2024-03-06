import React, { lazy } from 'react';
import InitialDataFetcher from '../initialDataFetcher/InitialDataFetcher';
import TournamentUserController from '../controllers/TournamentUserController';
import { CrucialLoader } from '../types';
import SuspenseWithLoader from '../_helpers/SuspenseWithLoader';
import NihusStickerProvider from '@/nihusim/NihusStickerProvider';
import { NihusStickerContextProvider } from '@/nihusim/context';

const AppBasicRoutes = lazy(() => import('./AppBasicRoutes'));


function AppContent() {
    return (
        <InitialDataFetcher>
            <TournamentUserController>
                <SuspenseWithLoader name={CrucialLoader.BasicRoutes}>
                    <NihusStickerContextProvider>
                        <NihusStickerProvider />
                        <AppBasicRoutes />
                    </NihusStickerContextProvider>
                </SuspenseWithLoader>
            </TournamentUserController>
        </InitialDataFetcher>
    )
}

export default AppContent
