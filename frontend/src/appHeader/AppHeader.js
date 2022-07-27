import React, { useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom'
import { UserContext } from '../contexts/user';

const routesMap = {
	"leaderboard": {
		label: "טבלת ניקוד",
		iconClass: "podium_icon"
	},
	"open-matches": {
		label: "הימורים פתוחים",
		iconClass: "bet_icon"
	},
	"closed-matches": {
		label: "צפייה בהימורים",
		iconClass: "watch_bets_icon"
	},
	"open-group-standings": {
		label: "הימורי בתים פתוחים",
	},
	"open-questions": {
		label: "הימורים מיוחדים פתוחים",
	},
	"all-group-standings": {
		label: "צפייה בהימורי בתים",
	},
	"all-questions": {
		label: "צפייה בהימורים מיוחדים",
	},
	"my-bets": {
		label: "הטופס שלי",
		iconClass: "form_icon",
	},
	"set-password": {
		label: "שנה סיסמה",
		iconClass: "change_password_icon",
	},
	"logout": {
		label: "התנתק",
		iconClass: "logout_icon",
	},
};

function AppHeader(props){
	const { user, isTourStarted } = props;
	const userContext = useContext(UserContext);
	const location = useLocation();
	const history = useHistory();
	const currentRoute = location.pathname.substring(1);
	
	const groupBetsRoute = isTourStarted ? "all-group-standings" : "open-group-standings";
	const specialBetsRoute = isTourStarted ? "all-questions" : "open-questions";
	const isPreTourActive = ["all-group-standings", "all-questions", "open-group-standings", "open-questions"].includes(currentRoute);
	

	function renderMenuItem(route){
		const isActive = currentRoute === route;
		const {iconClass, label} = routesMap[route];
		const onClick = (e) => {
			e.preventDefault();
			history.push(`/${route}`);
		}
		return <li key={route} className={isActive ? "active" : ""}>
			<a href={`/${route}`} onClick={onClick}>
				{iconClass ? <div className={`icon ${iconClass}`}></div> : null}
				<span className="menu-label">{label}</span>
			</a>
		</li>
  	}

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
					>יורו חברים - {userContext.name}</a>
				</div>
				<div className="collapse navbar-collapse" style={{"float": "right"}} id="myNavbar">
					<ul className="nav navbar-nav navbar-right">
						{renderMenuItem("leaderboard")}
						{renderMenuItem("open-matches")}
						{renderMenuItem("closed-matches")}
						<li key={"preTourBets"} className={`dropdown ${isPreTourActive ? "active" : ""}`}>
						<a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
							<div className="icon pre_game_icon"></div>
							<span className="menu-label">הימורים של לפני הטורניר</span><span className="caret" style={{"marginRight": "5px"}}></span>
						</a>
						<ul className="dropdown-menu">
							{renderMenuItem(groupBetsRoute)}
							{renderMenuItem(specialBetsRoute)}
						</ul>
						</li>
						{renderMenuItem("my-bets")}
					</ul>
					<ul className="nav navbar-nav navbar-left">
						{renderMenuItem("set-password")}
						{/* {renderMenuItem("logout")} */}
						<li>
							<a href='/logout'>
								<div className='icon logout_icon'></div>
								<span className="menu-label">התנתק</span>
							</a>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
}

export default AppHeader;