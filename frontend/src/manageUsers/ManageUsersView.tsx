import React, { useState, useEffect, useMemo } from 'react';
import { Paper, Table, TableBody, CircularProgress, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { AnyFunc, User, UserPermissions } from '../types';
import { UserPermissionsToRoleString } from '../utils';
import { UserAction } from './types';
import { GetUsersParams } from '../api/users';
import UserRow from './UserRow';
import SearchBar from '../widgets/SearchBar/SearchBar';
import MultipleSelect from '../widgets/Select/MultipleSelect';
import { debounce } from 'lodash';


interface Props {
	users: User[],
	fetchUsers: AnyFunc,
	makeTournamentAdmin: UserAction,
	revokeTournamentAdminPermissions: UserAction,
}


const loadingQueue = new Set();

function ManageUsersView({
	users,
	fetchUsers,
	makeTournamentAdmin,
	revokeTournamentAdminPermissions,
}: Props){	 
	const [search, setSearch] = useState('');
	const [roles, setRoles] = useState<UserPermissions[]>([]);
	const [loading, setLoading] = useState(false);

	const debouncedGetUsers = useMemo(
		() => debounce((params: GetUsersParams) => {
			setLoading(true);
			const ts = Number(new Date());
			loadingQueue.add(ts);
			fetchUsers(params)
				.finally(()=>{
					loadingQueue.delete(ts);
					if (loadingQueue.size === 0){
						setLoading(false);
					}
				});
		}, 300),
		[fetchUsers]
	);

	useEffect(()=>{
		debouncedGetUsers({
			search: search.length > 0 ? search : undefined,
			roles,
		});
		return () => {
			debouncedGetUsers.cancel()
		}
	}, [search, roles])

	return (<>
		<div style={{
			display: 'flex',
			alignItems: 'center',
		}}>
			<h1>משתמשים באפליקציה</h1>
			{loading && (
				<CircularProgress color="inherit" size={32} style={{marginRight: 30}}/>
			)}
		</div>
		<Paper style={{marginTop: 16}}>
			<div style={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'flex-start',
			}}>
				<SearchBar
					value={search}
					onChange={setSearch}
				/>
				<div style={{width: 250}}>
					<MultipleSelect
						value={roles}
						placeholder='Roles'
						onChange={setRoles}
						items={
							[
								UserPermissions.Admin,
								UserPermissions.TournamentAdmin,
								UserPermissions.User,
							].map(
								permissions => ({
									value: permissions,
									label: UserPermissionsToRoleString[permissions]
								})
							)
						}
					/>
				</div>
			</div>
			<TableContainer>
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
		</Paper>
	</>);
}


export default ManageUsersView;