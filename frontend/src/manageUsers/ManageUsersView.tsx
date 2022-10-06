import React, { useState, useEffect, useCallback } from 'react';
import { Paper, Pagination, Table, TableBody, CircularProgress, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { User, UserPermissions } from '../types';
import { UserPermissionsToRoleString } from '../utils';
import { UserAction } from './types';
import { GetUsersParams } from '../api/users';
import UserRow from './UserRow';
import SearchBar from '../widgets/SearchBar/SearchBar';
import MultipleSelect from '../widgets/Select/MultipleSelect';


const loadingQueue = new Set();

const USERS_PER_PAGE = 10;

interface Props {
	users: User[],
	totalCount: number,
	fetchUsers: (params: GetUsersParams) => Promise<void>,
	makeTournamentAdmin: UserAction,
	revokeTournamentAdminPermissions: UserAction,
}

function ManageUsersView({
	users,
	totalCount,
	fetchUsers,
	makeTournamentAdmin,
	revokeTournamentAdminPermissions,
}: Props){	 
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState('');
	const [roles, setRoles] = useState<UserPermissions[]>([]);
	const [loading, setLoading] = useState(false);

	const pagesCount = Math.ceil(totalCount / USERS_PER_PAGE);

	const getUsers = useCallback(
		(params: GetUsersParams) => {
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
		},
		[fetchUsers, setLoading]
	);

	useEffect(()=>{
		getUsers({
			search: search.length > 0 ? search : undefined,
			roles,
			limit: `${USERS_PER_PAGE}`,
			offset: `${USERS_PER_PAGE * (page - 1)}`,
		});
	}, [search, roles, page])

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
					defaultValue={search}
					onChange={val => {
						setSearch(val);
						setPage(1);
					}}
				/>
				<div style={{width: 250}}>
					<MultipleSelect
						value={roles}
						label='Roles'
						onChange={val => {
							setRoles(val);
							setPage(1);
						}}
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
			{pagesCount > 1 && (
				<Pagination
					count={pagesCount}
					page={page}
					onChange={(ev, page) => setPage(page)}
				/>
			)}
		</Paper>
	</>);
}


export default ManageUsersView;