import React, { useEffect, useState, useContext } from 'react';
import { Route, DefaultRoute, Router, Switch } from 'react-router-dom';
import { Redirect, useHistory } from 'react-router';
import { createBrowserHistory } from "history";

import AppHeader from './app_header/AppHeader';
import { UserProvider, UserContext } from './contexts/user';
import { TournamentProvider } from './contexts/tournament';
import Leaderboard from './leaderboard/leaderboard';
import './App.scss';
import OpenMatchesView from "./open_matches/openMatchesProvider";
import OpenGroupRankBetsView from "./preTournamentBets/OpenGroupRankBetsProvider";
import MatchesView from "./matches/ClosedMatchBetsProvider";
import GroupStandingsBetsView from "./group_bets/GroupStandingsBetsProvider";
import AllQuestionBetsView from "./special_bets/closedQuestionBets";
import MyBetsView from "./my_bets/myBetsView";
import { Provider as StoreProvider } from 'react-redux';
import store from './_helpers/store';
import AuthController from './auth/AuthController';
import TournamentUserController from './tournamentUser/TournamentUserController';
import InitialDataFetcher from './initialDataFetcher/InitialDataFetcher';

const customHistory = createBrowserHistory();

function Content(){
	const user = useContext(UserContext);
	if (!user.isConfirmed){
		return <h2>האתר יהיה זמין לך ברגע שתאושר על ידי אחד מהאדמינים</h2>
	}
	return <React.Fragment>
		<Switch>
		<Route path="/open-questions" component={OpenGroupRankBetsView} />
		<Route path="/open-group-standings" component={OpenGroupRankBetsView} />
		{/* ABOVE TBD ^--------^*/}
		{/* BELOW ARE DONE v-----v*/}
		<Route path="/open-matches" component={OpenMatchesView} />
		<Route path="/closed-matches" component={MatchesView} />
		<Route path="/leaderboard" component={Leaderboard} />
		<Route path="/all-group-standings" component={GroupStandingsBetsView} />
		<Route path="/all-questions" component={AllQuestionBetsView} />
		<Route path="/my-bets" component={MyBetsView} />
		<Route path="/">
			{/* <Route path="/closed-matches" component={MatchesView} /> */}
			<Redirect to='/open-group-standings'/>
		</Route>
	</Switch>
	</React.Fragment>
}

function AppLink({path, label}){
	const history = useHistory();
	const onClick = (e) =>{
		e.preventDefault();
		history.push(path);
	}
	return (
		// <p><a href={path} onClick={onClick}>{label}</a></p>
		<p><a href={path}>{label}</a></p>
	);
}

function AppLinks(props){
	const { isAdmin } = props;
	return <React.Fragment>
		<AppLink path='/articles' label='כתבות'/>
		<AppLink path='/terms' label='תקנון'/>
		{isAdmin ? <AppLink path='/admin/index' label='Admin Tools'/> : null}
	</React.Fragment>
}

function TournamentPrizes(props){
	const [prizes, setPrizes] = useState({});
	useEffect(()=>{
		//get prizes from API
		const gotFromAPI = {
			1: {
				id: 1,
				label: "מקום ראשון",
				amount: "1800 ₪",
			},
			2: {
				id: 2,
				label: "מקום שני",
				amount: "800 ₪",
			},
			3: {
				id: 3,
				label: "מקום שלישי",
				amount: "400 ₪",
			},
			4: {
				id: 4,
				label: "מקום רביעי",
				amount: "200 ₪",
			},
		}
		setPrizes(gotFromAPI);
	}, []);
	function renderPrize(prize){
		const {id, label, amount} = prize;
		return <div key={id} className={`well rank-${id}`}>
			<p>{label}<br></br>{amount}</p>
		</div>
	}
	return <React.Fragment>
		{Object.values(prizes).map(renderPrize)}
	</React.Fragment>
}

function App() {
	const isAdmin = true
	return (
	<StoreProvider store={store}>
		<AuthController>
			<TournamentUserController>
				<UserProvider>
					<TournamentProvider>
						<InitialDataFetcher>
							<Router history={customHistory}>
								<AppHeader isTourStarted={false}></AppHeader>
								<div className="container-fluid text-center">
									<div className="row content">
										<div className="col-sm-2 sidenav">
										<AppLinks isAdmin={isAdmin}></AppLinks>
										</div>
										<div className="col-sm-8 text-left">
											<Content></Content>
										</div>
										<div className="col-sm-2 sidenav">
											<TournamentPrizes></TournamentPrizes>
										</div>
									</div>
								</div>
								<footer className="container-fluid text-center">
									<p></p>
								</footer>
							</Router>
						</InitialDataFetcher>
					</TournamentProvider>
				</UserProvider>
			</TournamentUserController>
		</AuthController>
	</StoreProvider>
	);
}

export default App;