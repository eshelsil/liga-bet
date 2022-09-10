import React, { useEffect } from 'react';
import { useSelector, connect } from 'react-redux';
import {
	fetchAndStoreUsers,
	makeTournamentAdmin,
	revokeTournamentAdminPermissions
} from '../_actions/users';
import { NoSelector, Users, UsersTotalCount } from '../_selectors';
import ManageUserView from './ManageUsersView';


function ManageUsers({
	fetchAndStoreUsers,
  	makeTournamentAdmin,
  	revokeTournamentAdminPermissions,
}){
	const usersById = useSelector(Users);
	const totalCount = useSelector(UsersTotalCount);

	function upgradeToTournamentAdmin(userId: number){
		makeTournamentAdmin(userId)
			.then(()=> {
				window['toastr']["success"]('משתמש עודכן בהצלחה')
			})
	}
	function downgradeToRegularUser(userId: number){
		revokeTournamentAdminPermissions(userId)
			.then(()=> {
				window['toastr']["success"]('משתמש עודכן בהצלחה')
			})
	}

	return (<>
		<ManageUserView
			users={Object.values(usersById)}
			totalCount={totalCount}
			fetchUsers={fetchAndStoreUsers}
			makeTournamentAdmin={upgradeToTournamentAdmin}
			revokeTournamentAdminPermissions={downgradeToRegularUser}
		/>
	</>);
}

const mapDispatchToProps = {
	fetchAndStoreUsers,
  	makeTournamentAdmin,
  	revokeTournamentAdminPermissions,
}


export default connect(NoSelector, mapDispatchToProps)(ManageUsers);