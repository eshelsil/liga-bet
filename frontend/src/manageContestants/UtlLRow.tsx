import { TableCell, TableRow } from '@mui/material';
import React from 'react';
import { UTL, UtlRole } from '../types';
import { UtlRoleToString } from '../utils';
import { ConfirmUtlButton, MakeManagerButton, RemoveManagerButton, RemoveUtlButton } from './ActionButtons';
import { UtlAction } from './types';


interface Props {
	utl: UTL,
	isCurrentUtl: boolean,
	confirmUTL: UtlAction,
	removeUTL: UtlAction,
	promoteToManager: UtlAction,
	removeManagerPermissions: UtlAction,
	hasAdminPermissions: boolean,
	hasManagerPermissions: boolean,
}


function UTLRow({
	utl,
	isCurrentUtl,
	confirmUTL,
	removeUTL,
	promoteToManager,
	removeManagerPermissions,
	hasAdminPermissions,
	hasManagerPermissions,
}: Props){
	const isManager = utl.role === UtlRole.Manager;
	const isContestant = utl.role === UtlRole.Contestant;
	const isNotConfirmed = utl.role === UtlRole.NotConfirmed;
	const isDeleteable = [UtlRole.NotConfirmed, UtlRole.Monkey].includes(utl.role)
	return (
		<TableRow>
			<TableCell className="admin">{utl.id}</TableCell>
			<TableCell>{utl.name}</TableCell>
			<TableCell>{UtlRoleToString[utl.role]}</TableCell>
			<TableCell>
				{hasManagerPermissions && !isCurrentUtl && (<>
						{isNotConfirmed && (
							<ConfirmUtlButton
								action={()=>confirmUTL(utl.id)}
							/>
						)}
						{isDeleteable && (
							<RemoveUtlButton
								action={()=>removeUTL(utl.id)}
							/>
						)}
					{hasAdminPermissions && (<>
						{isManager && (
							<RemoveManagerButton
								action={()=>removeManagerPermissions(utl.id)}
							/>
						)}
						{isContestant && (
							<MakeManagerButton
								action={()=>promoteToManager(utl.id)}
							/>
						)}
					</>)}
				</>)}
			</TableCell>
		</TableRow>
	);
}


export default UTLRow;