import React from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from "history";
import AppHeader from './appHeader/AppHeaderProvider';
import { Provider as StoreProvider } from 'react-redux';
import store from './_helpers/store';
import AuthController from './auth/AuthController';
import AppBody from './appContent/AppBody';
import AppFooter from './appFooter/Footer';
import Banner from './appBanner/AppBannerView';
import './App.scss';


const customHistory = createBrowserHistory();

function App() {
	return (
	<StoreProvider store={store}>
		<AuthController>
			<Router history={customHistory}>
				<Banner />
				<AppHeader />
				<AppBody />
				<AppFooter />
			</Router>
		</AuthController>
	</StoreProvider>
	);
}

export default App;