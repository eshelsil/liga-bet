import React, { useEffect, useState, useContext } from 'react';
import { Route, DefaultRoute, Router, Switch } from 'react-router-dom';
import { createBrowserHistory } from "history";

import AppHeader from './app_header/AppHeader';
import { UserProvider, UserContext } from './contexts/user';
import { TournamentProvider } from './contexts/tournament';
import { TeamsProvider } from './contexts/teams';
import Leaderboard from './leaderboard/leaderboard';
import './App.scss';
import OpenMatchesView from "./open_matches/openMachesView";
import UserBetsView from "./user_bets/userBetsView";
import MatchesView from "./matches/machesView";
import GroupBetsView from "./group_bets/groupBets";
import SpecialBetsView from "./special_bets/specialBets";
import MyBetsView from "./my_bets/groupBets";

const customHistory = createBrowserHistory();

function Content(){
	const user = useContext(UserContext);
	if (!user.isConfirmed){
		return <h2>האתר יהיה זמין לך ברגע שתאושר על ידי אחד מהאדמינים</h2>
	}
	return <React.Fragment>
		<Switch>
		{/* <Route exact path="/leaderboard" component={GameConnectionController}/> */}
		{/*<Route path="/" component={Leaderboard} />*/}
		{/*<Route path="/" component={OpenMatchesView} />*/}
		{/*<Route path="/" component={UserBetsView} />*/}
		{/*<Route path="/" component={MatchesView} />*/}
		{/*<Route path="/" component={GroupBetsView} />*/}
		{/*<Route path="/" component={SpecialBetsView} />*/}
		<Route path="/" component={MyBetsView} />
		{/* <Route path="/">
			<h1>EURO FRIENDS</h1>;
		</Route> */}
	</Switch>
	</React.Fragment>
}

function AppLinks(props){
	const { isAdmin } = props;
	return <React.Fragment>
		<p><a href="/articles">כתבות</a></p>
		<p><a href="/terms">תקנון</a></p>
		{isAdmin ? <p><a href="/admin/index">Admin Tools</a></p> : null}
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
	return <UserProvider>
		<TournamentProvider>
			<TeamsProvider>
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
			</TeamsProvider>
		</TournamentProvider>
	</UserProvider>
}

export default App;