import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React from 'react';
import { User } from '../types';
import { UserAction } from './types';
import UserRow from './UserRow';


interface Props {
	users: User[],
	makeTournamentAdmin: UserAction,
	revokeTournamentAdminPermissions: UserAction,
}


function ManageUsersView({
	users,
	makeTournamentAdmin,
	revokeTournamentAdminPermissions,
}: Props){
	return (<>
		<h1>משתמשים באפליקציה</h1>
		<TableContainer component={Paper}>
      		<Table>
        		<TableHead>
          			<TableRow>
						<TableCell className="admin"></TableCell>
						<TableCell>שם</TableCell>
						<TableCell>שם משתמש</TableCell>
						<TableCell>הרשאות</TableCell>
						<TableCell>פעולות</TableCell>
          			</TableRow>
        		</TableHead>
        		<TableBody>
				{users.map(user => (
					<UserRow
						key={user.id}
						{...{
							user,
							makeTournamentAdmin,
							revokeTournamentAdminPermissions,
						}}
					/>
				))}
				</TableBody>
			</Table>
		</TableContainer>
	</>);
}


export default ManageUsersView;