import React from 'react';
import { Team, UTL } from '../../types';
import TeamFlag from '../../widgets/TeamFlag/TeamFlag';
import { useIsSmScreen } from '../../hooks/useMedia';



interface UserDetailsProps {
	utl: UTL,
	top: number,
	userColor: string,
	winnerTeam?: Team,
}


function UserDetails ({ utl, top, userColor, winnerTeam }: UserDetailsProps) {
	const isSmallScreen = useIsSmScreen()
	return (
		<div
			className={`LB-ProgressRowUserDetails`}
			style={{top}}
		>
			<div>
				<TeamFlag team={winnerTeam || {name: ''} as Team} size={24} />
			</div>
			<div className={'ProgressRowUserDetails-userName'} style={{ color: userColor }}>
				{isSmallScreen ? utl.name.slice(0,10) : utl.name}
			</div>
		</div>
	)
};

export default UserDetails;

