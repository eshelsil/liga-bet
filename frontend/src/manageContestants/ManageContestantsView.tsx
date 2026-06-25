import React from 'react'
import { useTranslation } from 'react-i18next'
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
    const { t } = useTranslation('manageContestants')

    return (
        <div className='LB-ManageContestantsView'>
            {!hasManagerPermissions && (
                <h1 className='LB-TitleText'>
                    {t('view.noPermissions')}
                </h1>
            )}
            {
                <>
                    <h1 className='LB-TitleText'>{t('view.title')}</h1>
                    <div className='LB-FloatingFrame' style={{paddingRight: 0}}>
                        <ul style={{margin: 0}}>
                            <li>{t('view.info.manageContestants')}</li>
                            <li>{t('view.info.chooseHelpers')}</li>
                            <li>{t('view.info.managerScope')}</li>
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
                                    <TableCell>{t('view.columns.name')}</TableCell>
                                    <TableCell>{t('view.columns.permissions')}</TableCell>
                                    <TableCell>{t('view.columns.actions')}</TableCell>
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
