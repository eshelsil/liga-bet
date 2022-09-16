import React from 'react';
import MenuItem from './MenuItem'
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import UserIcon from '@mui/icons-material/Person';
import { routesMap } from './routes'


interface Props {
	currentUsername: string,
	currentRoute: string,
	deselectUtl: () => void,
	goToUserPage: () => void,
}

function UserMenuView({
	currentUsername,
	currentRoute,
	deselectUtl,
	goToUserPage,
}: Props){
	return (
		<nav className="LigaBet-UserMenu navbar navbar-inverse">
			<div className="container-fluid">
				<div className="navbar-header" style={{"float": "right", "textAlign": "right"}}>
					<button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#AppHeader-UserMenu">
						<span className="icon-bar"></span>
						<span className="icon-bar"></span>
						<span className="icon-bar"></span>
					</button>
					<a
						className="navbar-brand"
						href="/"
						onClick={e => {
							e.preventDefault();
							goToUserPage();
						}}
					>
						<UserIcon />
						<span> {currentUsername} </span>
					</a>
				</div>
				<div className="collapse navbar-collapse" id="AppHeader-UserMenu">
				<ul className="nav navbar-nav navbar-right">
					<MenuItem route={routesMap['choose-utl']} currentPath={currentRoute}
						onClick={deselectUtl}
						icon={<EmojiEventsOutlinedIcon className='headerIcon' />}
					/>
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
			</div>
		</nav>
	);
}

export default UserMenuView;