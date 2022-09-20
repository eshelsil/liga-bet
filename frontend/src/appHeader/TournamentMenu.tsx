import React from 'react';
import { UtlWithTournament } from '../types';
import { hasManagePermissions, isUtlConfirmed } from '../utils';
import ManageUTLsIcon from '@mui/icons-material/PeopleAltOutlined';
import TournamentIcon from '@mui/icons-material/EmojiEventsOutlined';
import MenuItem from './MenuItem'
import { routesMap } from './routes'


interface Props {
	currentUtl: UtlWithTournament,
	isTournamentStarted: boolean,
	currentRoute: string,
	goToUtlPage: () => void,
}

function TournamentMenu({
	isTournamentStarted,
	currentUtl,
	currentRoute,
	goToUtlPage,
}: Props){
	const showManagerManagementViews = hasManagePermissions(currentUtl);
	const isConfirmedUtl = isUtlConfirmed(currentUtl);
	
	const groupBetsRoute = isTournamentStarted ? "all-group-standings" : "open-group-standings";
	const specialBetsRoute = isTournamentStarted ? "all-questions" : "open-questions";
	const isPreTourActive = ["all-group-standings", "all-questions", "open-group-standings", "open-questions"].includes(currentRoute);


	return (
		<nav className="LigaBet-TourmnamentMenu navbar navbar-inverse">
			<div className="container-fluid">
				<div className="navbar-header" style={{"float": "right", "textAlign": "right"}}>
					<button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#AppHeader-TournamentMenu">
						<span className="icon-bar"></span>
						<span className="icon-bar"></span>
						<span className="icon-bar"></span>
					</button>
					<a
						className="navbar-brand"
						href="/"
						onClick={e => {
							e.preventDefault();
							goToUtlPage();
						}}
					>
						<TournamentIcon />
						<span>{currentUtl.name}</span>
					</a>
				</div>
				<div className="collapse navbar-collapse" id="AppHeader-TournamentMenu">
				{isConfirmedUtl && (<>
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
				</>)}
					<ul className="nav navbar-nav navbar-left">
						{showManagerManagementViews && (
							<MenuItem
								route={routesMap['contestants']}
								currentPath={currentRoute}
								icon={<ManageUTLsIcon className='headerIcon' />}
							/>
						)}
					</ul>
				</div>
			</div>
		</nav>
	);
}

export default TournamentMenu;