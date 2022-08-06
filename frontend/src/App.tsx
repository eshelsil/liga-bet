import React from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from "history";
import AppHeader from './appHeader/AppHeaderProvider';
import { Provider as StoreProvider } from 'react-redux';
import store from './_helpers/store';
import AuthController from './auth/AuthController';
import TournamentUserController from './tournamentUser/TournamentUserController';
import InitialDataFetcher from './initialDataFetcher/InitialDataFetcher';
import AppBody from './appContent/AppBody';
import AppFooter from './appFooter/Footer';
import './App.scss';


const customHistory = createBrowserHistory();

function App() {
	return (
	<StoreProvider store={store}>
		<AuthController>
			<TournamentUserController>
				<InitialDataFetcher>
					<Router history={customHistory}>
						<AppHeader />
						<AppBody />
						<AppFooter />
					</Router>
				</InitialDataFetcher>
			</TournamentUserController>
		</AuthController>
	</StoreProvider>
	);
}

export default App;