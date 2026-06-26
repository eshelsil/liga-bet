import {
    Table,
    tableCellClasses,
    TableBody,
    TableCell,
    TableRow,
} from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { User } from '../types'
import { UserPermissionsToRoleStringHebrew } from '../utils'
import './MyUser.scss'

interface Props {
    currentUser: User
}

function MyUser({ currentUser }: Props) {
    const { t } = useTranslation('myUser')
    return (
        <div className="LigaBet-UserPage">
            <h1 className="title LB-TitleText">{t('title')}</h1>
            <div className="UserDetailsCard">
                <Table
                    sx={{
                        [`& .${tableCellClasses.root}`]: {
                            border: 'none',
                            textAlign: 'right',
                        },
                    }}
                >
                    <TableBody>
                        <TableRow>
                            <TableCell className="property">{t('labels.email')}</TableCell>
                            <TableCell>
                                {currentUser.email}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="property">{t('labels.permissions')}</TableCell>
                            <TableCell>
                                {
                                    UserPermissionsToRoleStringHebrew[
                                        currentUser.permissions
                                    ]
                                }
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default MyUser
