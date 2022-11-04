import { TableCell, TableRow } from '@mui/material'
import React from 'react'
import { UTL, UtlRole } from '../types'
import { UtlRoleToString } from '../utils'
import {
    ConfirmUtlButton,
    MakeManagerButton,
    RemoveManagerButton,
    RemoveUtlButton,
} from './ActionButtons'
import { UtlAction } from './types'

interface Props {
    utl: UTL
    isCurrentUtl: boolean
    confirmUTL: UtlAction
    removeUTL: UtlAction
    promoteToManager: UtlAction
    removeManagerPermissions: UtlAction
    hasAdminPermissions: boolean
    hasManagerPermissions: boolean
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
}: Props) {
    const isManager = utl.role === UtlRole.Manager
    const isContestant = utl.role === UtlRole.Contestant
    const isNotConfirmed = utl.role === UtlRole.NotConfirmed
    const canBeDeletedByManager = [UtlRole.Contestant, UtlRole.NotConfirmed, UtlRole.Monkey].includes(utl.role)
    const canBeDeletedByAdmin = isManager || canBeDeletedByManager
    const isDeleteable = (hasAdminPermissions && canBeDeletedByAdmin) || (hasManagerPermissions && canBeDeletedByManager)
    return (
        <TableRow className={'LB-ContestantRow'}>
            <TableCell className="admin">{utl.id}</TableCell>
            <TableCell>{utl.name}</TableCell>
            <TableCell>{UtlRoleToString[utl.role]}</TableCell>
            <TableCell className='actionsCell'>
                {hasManagerPermissions && !isCurrentUtl && (
                    <>
                        {hasAdminPermissions && (
                            <>
                                {isManager && (
                                    <RemoveManagerButton
                                        action={async () => await removeManagerPermissions(utl.id)}
                                    />
                                )}
                                {isContestant && (
                                    <MakeManagerButton
                                        action={async () => await promoteToManager(utl.id)}
                                    />
                                )}
                            </>
                        )}
                        {isNotConfirmed && (
                            <ConfirmUtlButton
                                action={async () => await confirmUTL(utl.id)}
                            />
                        )}
                        {isDeleteable && (
                            <RemoveUtlButton action={async () => await removeUTL(utl.id)} />
                        )}
                    </>
                )}
            </TableCell>
        </TableRow>
    )
}

export default UTLRow
