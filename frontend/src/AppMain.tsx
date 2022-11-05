import React, { lazy, Suspense } from 'react'
import AppHeader from './appHeader/AppHeaderProvider'
import './App.scss'

const DialogsProvider = lazy(() => import('./dialogs/DialogsProvider'));
const AppBody = lazy(() => import('./appContent/AppBody'));


function AppMain() {
    return (
        <>
            <AppHeader />
            <Suspense fallback={
                <div style={{display: 'inline-block', margin: 'auto', padding: 100}}>טוען...</div>
            }>
                <AppBody />
            </Suspense>
            <Suspense fallback={<div></div>}>
                <DialogsProvider />
            </Suspense>
        </>
    )
}

export default AppMain
