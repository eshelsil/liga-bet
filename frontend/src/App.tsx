import React, { lazy, Suspense } from 'react'
import { Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import { Provider as StoreProvider } from 'react-redux'
import ThemeProvider from '@mui/material/styles/ThemeProvider'
import store from './_helpers/store'
import AuthController from './auth/AuthController'
import AppFooter from './appFooter/Footer'
import Banner from './appBanner/AppBannerView'
import { theme } from './themes/theme'
import RTL from './_helpers/RTL'

const AppMain = lazy(() => import('./AppMain'));


const customHistory = createBrowserHistory()

function App() {
    return (
        <StoreProvider store={store}>
            <ThemeProvider theme={theme}>
                <RTL>
                    <Router history={customHistory}>
                        <AuthController>
                            {/*<Banner />*/}
                            <Suspense fallback={<div>Loading...</div>}>
                                <AppMain />
                            </Suspense>
                            <AppFooter />
                        </AuthController>
                    </Router>
                </RTL>
            </ThemeProvider>
        </StoreProvider>
    )
}

export default App
