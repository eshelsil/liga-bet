import React, { lazy, Suspense } from 'react'
import AppHeader from './appHeader/AppHeaderProvider'
import AppFooter from './appFooter/Footer';
import SuspenseWithLoader from './_helpers/SuspenseWithLoader';
import './App.scss'
import { CrucialLoader } from './types';

const DialogsProvider = lazy(() => import('./dialogs/DialogsProvider'));
const AppBody = lazy(() => import('./appContent/AppBody'));


function AppMain() {
    return (
        <>
            <AppHeader />
            <SuspenseWithLoader name={CrucialLoader.Body}>
                <AppBody />
                <AppFooter />
            </SuspenseWithLoader>
            <Suspense fallback={<div></div>}>
                <DialogsProvider />
            </Suspense>
        </>
    )
}

export default AppMain
