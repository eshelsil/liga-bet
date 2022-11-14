import React from 'react'
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material'
import { UTL } from '../types'
import { UtlAction } from './types'
import UTLRow from './UtlLRow'
import './ManageContestants.scss'
import AutoConfirmSelection from './AutoConfirmSelection'

interface Props {
    utls: UTL[]
    confirmUTL: UtlAction
    removeUTL: UtlAction
    promoteToManager: UtlAction
    removeManagerPermissions: UtlAction
    updateAutoConfirmPref: (val: boolean) => Promise<void>
    isTournamentAdmin: boolean
    hasManagerPermissions: boolean
    currentUtlId: number
}

function ManageContestantsView({
    utls,
    confirmUTL,
    removeUTL,
    promoteToManager,
    removeManagerPermissions,
    updateAutoConfirmPref,
    isTournamentAdmin,
    currentUtlId,
    hasManagerPermissions,
}: Props) {

    return (
        <div className='LB-ManageContestantsView'>
            {!hasManagerPermissions && (
                <h1 className='LB-TitleText'>
                    כדי לצפות ברשימת המשתתפים עלייך להחזיק בהרשאות מנהל או עוזר מנהל לטורניר
                    זה
                </h1>
            )}
            {
                <>
                    <h1 className='LB-TitleText'>משתתפים</h1>
                    <div className='LB-FloatingFrame' style={{paddingRight: 0}}>
                        <ul style={{margin: 0}}>
                            <li>באפשרותך לאשר או למחוק משתתפים בטורניר</li>
                            <li>אתה יכול לבחור חברים שיעזרו לך לנהל את המשתתפים</li>
                            <li>עוזר מנהל רשאי לאשר או למחוק משתתפים שאינם עוזרי מנהל</li>
                        </ul>
                    </div>
                    <div className='LB-FloatingFrame' style={{paddingBottom: 4}}>
                        <AutoConfirmSelection updateAutoConfirmPref={updateAutoConfirmPref} />
                    </div>

                    <TableContainer component={Paper} className='LB-CustomTable'>
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
                                            isCurrentUtl:
                                                currentUtlId === utl.id,
                                            confirmUTL,
                                            removeUTL,
                                            promoteToManager,
                                            removeManagerPermissions,
                                            hasAdminPermissions:
                                                isTournamentAdmin,
                                            hasManagerPermissions,
                                        }}
                                    />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            }
        </div>
    )
}

export default ManageContestantsView
