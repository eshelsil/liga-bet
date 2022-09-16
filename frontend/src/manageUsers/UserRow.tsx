import React from 'react';
import { Button, TableCell, TableRow } from '@mui/material';
import { User, UserPermissions } from '../types';
import { UserPermissionsToRoleString } from '../utils';
import { UserAction } from './types';


interface Props {
	user: User,
	makeTournamentAdmin: UserAction,
	revokeTournamentAdminPermissions: UserAction,
}


function UserRow({
	user,
	makeTournamentAdmin,
	revokeTournamentAdminPermissions,
}: Props){
	return (
		<TableRow>
			<TableCell className="admin">{user.id}</TableCell>
			<TableCell>{user.name}</TableCell>
			<TableCell>{user.username}</TableCell>
			<TableCell>{UserPermissionsToRoleString[user.permissions]}</TableCell>
			<TableCell>
				{user.permissions === UserPermissions.User && (
					<Button
						variant='contained'
						color='primary'
						onClick={() => makeTournamentAdmin(user.id)}
					> הפוך למנהל טורניר </Button>
				)}
				{user.permissions === UserPermissions.TournamentAdmin && (
					<Button
						variant='contained'
						color='secondary'
						onClick={() => revokeTournamentAdminPermissions(user.id)}
					> הסר הרשאות מנהל טורניר </Button>
				)}
			</TableCell>
		</TableRow>
	);
}


export default UserRow;