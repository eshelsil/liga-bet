import React, { lazy, Suspense } from 'react'
import AppHeader from './appHeader/AppHeaderProvider'
import SuspenseWithLoader from './_helpers/SuspenseWithLoader';
import { CrucialLoader } from './types';
import './App.scss'

const DialogsProvider = lazy(() => import('./dialogs/DialogsProvider'));
const AppBody = lazy(() => import('./appContent/AppBody'));


function AppMain() {
    return (
		<div className='LB-AppMainWrapper'>
			<div className='LB-AppBottomShadow'/>
            <AppHeader />
            <SuspenseWithLoader name={CrucialLoader.Body}>
                <AppBody />
            </SuspenseWithLoader>
            <Suspense fallback={<div></div>}>
                <DialogsProvider />
            </Suspense>
		</div>
    )
}

export default AppMain
