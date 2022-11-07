import {
    Table,
    tableCellClasses,
    TableBody,
    TableCell,
    TableRow,
} from '@mui/material'
import React from 'react'
import { User } from '../types'
import { UserPermissionsToRoleStringHebrew } from '../utils'
import './MyUser.scss'

interface Props {
    currentUser: User
}

function MyUser({ currentUser }: Props) {
    return (
        <div className="LigaBet-UserPage">
            <h1 className="title">המשתמש שלי</h1>
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
                            <TableCell className="property">אימייל</TableCell>
                            <TableCell>
                                {currentUser.email}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="property">הרשאות</TableCell>
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
