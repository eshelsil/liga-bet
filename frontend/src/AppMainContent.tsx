import React, { lazy, Suspense } from 'react'
import AppHeader from './appHeader/AppHeaderProvider'
import AppBottomNavProvider from './appHeader/AppBottomNavProvider'
import SuspenseWithLoader from './_helpers/SuspenseWithLoader'
import { CrucialLoader } from './types'

const DialogsProvider = lazy(() => import('./dialogs/DialogsProvider'))
const AppBody = lazy(() => import('./appContent/AppBody'))

function AppMainContent() {
    return (
        <div className="LB-AppMainWrapper">
            <div className="LB-AppBottomShadow" />
            <AppHeader />
            <SuspenseWithLoader name={CrucialLoader.Body}>
                <AppBody />
            </SuspenseWithLoader>
            <AppBottomNavProvider />
            <Suspense fallback={<div></div>}>
                <DialogsProvider />
            </Suspense>
        </div>
    )
}

export default AppMainContent
