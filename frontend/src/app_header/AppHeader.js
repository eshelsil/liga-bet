import React, { useContext } from 'react';
import { useHistory, useLocation } from 'react-router-dom'
import { UserContext } from '../user/user';

const routesMap = {
	"home": {
		label: "טבלת ניקוד",
		iconClass: "podium_icon"
	},
	"open-matches": {
		label: "הימורים פתוחים",
		iconClass: "bet_icon"
	},
	"today-matches": {
		label: "צפייה בהימורים",
		iconClass: "watch_bets_icon"
	},
	"open-group-bets": {
		label: "הימורי בתים פתוחים",
	},
	"open-special-bets": {
		label: "הימורים מיוחדים פתוחים",
	},
	"all-group-bets": {
		label: "צפייה בהימורי בתים",
	},
	"all-special-bets": {
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
	
	const groupBetsRoute = isTourStarted ? "all-group-bets" : "open-group-bets";
	const specialBetsRoute = isTourStarted ? "all-special-bets" : "open-special-bets";
	const isPreTourActive = ["all-group-bets", "all-special-bets", "open-group-bets", "open-special-bets"].includes(currentRoute);
	
	const navigate = (path) => {
	}

	function renderMenuItem(route){
		const isActive = currentRoute === route;
		const {iconClass, label} = routesMap[route];
		return <li key={route} className={isActive ? "active" : ""}>
			<a href="#" onClick={
				e => {
					e.preventDefault();
					history.push(`/${route}`);
				}
			}>
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
					<a className="navbar-brand" href="/home">יורו חברים - {userContext.name}</a>
				</div>
				<div className="collapse navbar-collapse" style={{"float": "right"}} id="myNavbar">
					<ul className="nav navbar-nav navbar-right">
						{renderMenuItem("home")}
						{renderMenuItem("open-matches")}
						{renderMenuItem("today-matches")}
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
						{renderMenuItem("logout")}
					</ul>
				</div>
			</div>
		</nav>
	);
}

export default AppHeader;