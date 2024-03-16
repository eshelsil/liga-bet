import React, { lazy, Suspense } from 'react'
import { Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { Provider as StoreProvider } from 'react-redux'
import ThemeProvider from '@mui/material/styles/ThemeProvider'
import store from './_helpers/store'
import AuthController from './auth/AuthController'
import Banner from './appBanner/AppBannerView'
import { theme } from './themes/theme'
import RTL from './_helpers/RTL'
import AppLoader from './appLoader'
import SuspenseWithLoader from './_helpers/SuspenseWithLoader'
import { CrucialLoader } from './types'
import SentryController from './SentryController'

const AppMain = lazy(() => import('./AppMain'));


const customHistory = createBrowserHistory()

function App() {
    return (
        <SentryController>
            <StoreProvider store={store}>
                <ThemeProvider theme={theme}>
                    <RTL>
                        <Router history={customHistory}>
                            <AuthController>
                                {/*<Banner />*/}
                                <SuspenseWithLoader name={CrucialLoader.Main}>
                                    <AppMain />
                                </SuspenseWithLoader>
                                <AppLoader />
                            </AuthController>
                        </Router>
                    </RTL>
                </ThemeProvider>
            </StoreProvider>
        </SentryController>
    )
}

export default App
