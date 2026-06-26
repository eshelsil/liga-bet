import React, { lazy, Suspense } from 'react'
import { Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { Provider as StoreProvider } from 'react-redux'
import store from './_helpers/store'
import AuthController from './auth/AuthController'
import Banner from './appBanner/AppBannerView'
import LocalizationProvider from './i18n/LocalizationProvider'
import AppLoader from './appLoader'
import SuspenseWithLoader from './_helpers/SuspenseWithLoader'
import { CrucialLoader } from './types'
import SentryController from './SentryController'
import './App.scss'
import './tailwind.css'

const AppMainContent = lazy(() => import('./AppMainContent'))

const customHistory = createBrowserHistory()

function App() {
    return (
        <SentryController>
            <StoreProvider store={store}>
                <LocalizationProvider>
                    <Router history={customHistory}>
                        <AuthController>
                            {/*<Banner />*/}
                            <SuspenseWithLoader name={CrucialLoader.Main}>
                                <AppMainContent />
                            </SuspenseWithLoader>
                            <AppLoader />
                        </AuthController>
                    </Router>
                </LocalizationProvider>
            </StoreProvider>
        </SentryController>
    )
}

export default App
