import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { useLocation } from 'react-router-dom'

import { createBrowserHistory } from "history";
// import { Container, Row } from 'react-bootstrap';

// import AppHeader from './app_header/app_header';
// import AuthController from './authenticate/auth_controller';
// import GameConnectionController from './connect_game/game_conn_controller';
// import LobbyPage from './game_lobby/lobby_controller';
// import ServerErrorModal from './widgets/modal_error';
import './App.scss';

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
}
function AppHeader(props){
  const {user, isTourStarted} = props;
  const location = useLocation();
  const currentRoute = location.pathname.substring(1);
  
  const groupBetsRoute = isTourStarted ? "all-group-bets" : "open-group-bets";
  const specialBetsRoute = isTourStarted ? "all-special-bets" : "open-special-bets";

  const isPreTourActive = ["all-group-bets", "all-special-bets", "open-group-bets", "open-special-bets"].includes(currentRoute);

  function renderMenuItem(route){
    const isActive = currentRoute === route;
    const {iconClass, label} = routesMap[route];
    return <li key={route} className={isActive ? "active" : ""}>
      <a href={`/${route}`}>
        {iconClass ? <div className={`icon ${iconClass}`}></div> : null}
        <span className="menu-label">{label}</span>
      </a>
    </li>
  }
  return <nav className="navbar navbar-inverse">
    <div className="container-fluid">
        <div className="navbar-header" style={{"float": "right!important", "textAlign": "right"}}>
            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="/home">יורו חברים - {user.name}</a>
        </div>
        <div className="collapse navbar-collapse" style={{"float": "right!important"}} id="myNavbar">
            
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
}


const customHistory = createBrowserHistory();

function App(props) {

  const isAdmin = true
  return <React.Fragment>
     <Router history={customHistory}>

      <AppHeader user={{name: "eshel"}} isTourStarted={false}></AppHeader>
      <div className="container-fluid text-center">
        <div className="row content">
          <div className="col-sm-2 sidenav">
              <p><a href="/articles">כתבות</a></p>
              <p><a href="/terms">תקנון</a></p>
              {isAdmin ? <p><a href="/admin/index">Admin Tools</a></p> : null}
          </div>
          <div className="col-sm-8 text-left">
            <h1>EURO FRIENDS</h1>
          </div>
          <div className="col-sm-2 sidenav">
              <div className="well rank-1">
                  <p>מקום ראשון<br></br>1800 ₪</p>
              </div>
              <div className="well rank-2">
                  <p>מקום שני<br></br>800 ₪</p>
              </div>
              <div className="well rank-3">
                  <p>מקום שלישי<br></br>400 ₪</p>
              </div>
              <div className="well rank-4">
                  <p>מקום רביעי<br></br>200 ₪</p>
              </div>
          </div>
        </div>
      </div>
      
      <footer className="container-fluid text-center">
        <p></p>
      </footer>
     </Router>
  </React.Fragment>
}

export default App;