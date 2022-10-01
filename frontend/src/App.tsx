import React from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from "history";
import { Provider as StoreProvider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import AppHeader from './appHeader/AppHeaderProvider';
import store from './_helpers/store';
import AuthController from './auth/AuthController';
import AppBody from './appContent/AppBody';
import AppFooter from './appFooter/Footer';
import Banner from './appBanner/AppBannerView';
import DialogsProvider from './dialogs/DialogsProvider';
import { theme } from './themes/theme';
import './App.scss';
import RTL from './_helpers/RTL';


const customHistory = createBrowserHistory();

function App() {
	return (
	<StoreProvider store={store}>
		<ThemeProvider theme={theme}>
			<RTL>
				<AuthController>
					<Router history={customHistory}>
						<Banner />
						<AppHeader />
						<AppBody />
						<AppFooter />
						<DialogsProvider />
					</Router>
				</AuthController>
			</RTL>
		</ThemeProvider>
	</StoreProvider>
	);
}

export default App;