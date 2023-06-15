import React from 'react';
import { Team, UTL } from '../../types';
import TeamFlag from '../../widgets/TeamFlag/TeamFlag';



interface UserDetailsProps {
	utl: UTL,
	top: number,
	userColor: string,
	winnerTeam?: Team,
}


function UserDetails ({ utl, top, userColor, winnerTeam }: UserDetailsProps) {
	return (
		<div
			className={`LB-ProgressRowUserDetails`}
			style={{top}}
		>
			<div>
				<TeamFlag name={winnerTeam?.name ?? ''} size={24} />
			</div>
			<div className={'ProgressRowUserDetails-userName'} style={{ color: userColor }}>
				{utl.name}
			</div>
		</div>
	)
};

export default UserDetails;

