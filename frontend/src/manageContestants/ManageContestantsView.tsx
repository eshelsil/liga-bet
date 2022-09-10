import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React from 'react';
import { UTL } from '../types';
import { UtlAction } from './types';
import UTLRow from './UtlLRow';


interface Props {
	utls: UTL[],
	confirmUTL: UtlAction,
	removeUTL: UtlAction,
	promoteToManager: UtlAction,
	removeManagerPermissions: UtlAction,
	isTournamentAdmin: boolean,
	hasManagerPermissions: boolean,
	currentUtlId: number,
}


function ManageContestantsView({
	utls,
	confirmUTL,
	removeUTL,
	promoteToManager,
	removeManagerPermissions,
	isTournamentAdmin,
	currentUtlId,
	hasManagerPermissions,
}: Props){
	return (<>
	{!hasManagerPermissions && (
		<h1>כדי לצפות ברשימת המשתתפים עלייך להחזיק בהרשאות מנהל לטורניר זה</h1>
	)}
	{(<>
		<h1>משתתפים</h1>
		<TableContainer component={Paper}>
      		<Table>
        		<TableHead>
          			<TableRow>
						<TableCell className="admin"></TableCell>
						<TableCell>שם</TableCell>
						<TableCell>הרשאות</TableCell>
						<TableCell>פעולות</TableCell>
          			</TableRow>
        		</TableHead>
        		<TableBody>
				{utls.map((utl) => (
					<UTLRow
						key={utl.id}
						{...{
							utl,
							isCurrentUtl: currentUtlId === utl.id,
							confirmUTL,
							removeUTL,
							promoteToManager,
							removeManagerPermissions,
							hasAdminPermissions: isTournamentAdmin,
							hasManagerPermissions,
						}}
					/>
				))}
				</TableBody>
			</Table>
		</TableContainer>
	</>)}
	</>);
}


export default ManageContestantsView;