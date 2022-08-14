import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom'
import { HasCurrentUtl } from '../_selectors';
import MenuItem from './MenuItem'
import { routesMap } from './routes'


interface Props {
	currentUserName: string,
	isTournamentStarted: boolean,
	currentRoute: string,
}

function AppHeader({
	isTournamentStarted,
	currentUserName,
	currentRoute,
}: Props){
	const history = useHistory();
	
	const groupBetsRoute = isTournamentStarted ? "all-group-standings" : "open-group-standings";
	const specialBetsRoute = isTournamentStarted ? "all-questions" : "open-questions";
	const isPreTourActive = ["all-group-standings", "all-questions", "open-group-standings", "open-questions"].includes(currentRoute);
	const hasCurrentUtl = useSelector(HasCurrentUtl);

	return (
		<nav className="navbar navbar-inverse">
			<div className="container-fluid">
				<div className="navbar-header" style={{"float": "right", "textAlign": "right"}}>
					<button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
						<span className="icon-bar"></span>
						<span className="icon-bar"></span>
						<span className="icon-bar"></span>
					</button>
					<a
						className="navbar-brand"
						href="/"
						onClick={e => {
							e.preventDefault();
							history.push('/');
						}}
					>Liga 'ב - {currentUserName}</a>
				</div>
				{hasCurrentUtl && (
				<div className="collapse navbar-collapse" style={{"float": "right"}} id="myNavbar">
					<ul className="nav navbar-nav navbar-right">
						<MenuItem route={routesMap['leaderboard']} currentPath={currentRoute} />
						<MenuItem route={routesMap['open-matches']} currentPath={currentRoute} />
						<MenuItem route={routesMap['closed-matches']} currentPath={currentRoute} />
						<li key={"preTourBets"} className={`dropdown ${isPreTourActive ? "active" : ""}`}>
						<a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
							<div className="icon pre_game_icon"></div>
							<span className="menu-label">הימורים של לפני הטורניר</span><span className="caret" style={{"marginRight": "5px"}}></span>
						</a>
						<ul className="dropdown-menu">
							<MenuItem route={routesMap[groupBetsRoute]} currentPath={currentRoute} />
							<MenuItem route={routesMap[specialBetsRoute]} currentPath={currentRoute} />
						</ul>
						</li>
						<MenuItem route={routesMap['my-bets']} currentPath={currentRoute} />
					</ul>
					<ul className="nav navbar-nav navbar-left">
						<MenuItem route={routesMap['set-password']} currentPath={currentRoute} />
						<li>
							<a href='/logout'>
								<div className='icon logout_icon'></div>
								<span className="menu-label">התנתק</span>
							</a>
						</li>
					</ul>
				</div>
				)}
			</div>
		</nav>
	);
}

export default AppHeader;