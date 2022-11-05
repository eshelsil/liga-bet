import React, { lazy, Suspense } from 'react';
import TournamentUserController from '../controllers/TournamentUserController';

const AppBasicRoutes = lazy(() => import('./AppBasicRoutes'));


function AppContent() {
    return (
        <TournamentUserController>
            <Suspense fallback={<div>טוען...</div>}>
                <AppBasicRoutes />
            </Suspense>
        </TournamentUserController>
    )
}

export default AppContent
