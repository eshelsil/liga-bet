import {
    Checkbox,
    FormControlLabel,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import { UTL } from '../types'
import { IsOnAutoConfirmUtls } from '../_selectors'
import { UtlAction } from './types'
import UTLRow from './UtlLRow'
import './ManageContestants.scss'

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
    const autoConfirm = useSelector(IsOnAutoConfirmUtls)
    const toggleAutoConfirm = (e: any, value: boolean) => {
        updateAutoConfirmPref(value)
            .then(() => {
                if (value) {
                    (window as any).toastr["success"]('עודכן בהצלחה. מעכשיו משתמשים יאושרו אוטמטית');
                } else {
                    (window as any).toastr["success"]('עודכן בהצלחה. המשתמשים הבאים שירשמו לטורניר יחכו שתאשר אותם לפני שיוכלו להמר');
                }
            })
    }

    return (
        <div className='LB-ManageContestantsView'>
            {!hasManagerPermissions && (
                <h1>
                    כדי לצפות ברשימת המשתתפים עלייך להחזיק בהרשאות מנהל לטורניר
                    זה
                </h1>
            )}
            {
                <>
                    <h1>משתתפים</h1>
                    <ul>
                        <li>באפשרותך לאשר או למחוק משתתפים בטורניר</li>
                        <li>אתה יכול לבחור חברים שיעזרו לך לנהל את המשתתפים</li>
                        <li>מנהל רשאי לאשר או למחוק משתתפים שאינם מנהלים</li>
                    </ul>

                    <FormControlLabel
                        control={
                            <Checkbox
                                size='medium'
                                checked={autoConfirm}
                                onChange={toggleAutoConfirm}
                            />
                        }
                        label="אשר משתמשים אוטומטית"
                    />
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
