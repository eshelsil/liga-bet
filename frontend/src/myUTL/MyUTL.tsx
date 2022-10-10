import {
    Table,
    tableCellClasses,
    TableBody,
    TableCell,
    TableRow,
    IconButton,
    TextField,
    Link,
} from '@mui/material'
import React, { useState } from 'react'
import { UtlWithTournament } from '../types'
import { UtlRoleToString } from '../utils'
import EditIcon from '@mui/icons-material/Edit'
import CloseIcon from '@mui/icons-material/Close'
import DoneIcon from '@mui/icons-material/Done'
import './MyUTL.scss'

interface Props {
    currentUtl: UtlWithTournament
    updateUTL: (params: { name: string }) => Promise<void>
    goToMyBets: () => void
    tableData?: {
        rank: number
        score: number
    }
}

function MyUTL({ currentUtl, updateUTL, goToMyBets, tableData }: Props) {
    const [edit, setEdit] = useState(false)
    const [name, setName] = useState(currentUtl.name)

    const toggleEdit = () => setEdit(!edit)

    const update = () => {
        updateUTL({ name }).then(() => {
            setEdit(false)
            window['toastr']['success']('הפרופיל עודכן')
        })
    }

    const updateName = (e) => setName(e.target.value)

    return (
        <div className="LigaBet-UTLPage">
            <h1 className="title">הפרופיל שלך</h1>
            <div className="UserDetailsCard">
                {edit && (
                    <IconButton className="confirmButton" onClick={update}>
                        <DoneIcon />
                    </IconButton>
                )}
                <IconButton className="editButton" onClick={toggleEdit}>
                    {!edit && <EditIcon />}
                    {edit && <CloseIcon />}
                </IconButton>
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
                            <TableCell className="property">שם</TableCell>
                            <TableCell className="nameValue">
                                {edit && (
                                    <div className="nameInput">
                                        <TextField
                                            value={name}
                                            onChange={updateName}
                                            label="שם"
                                        />
                                    </div>
                                )}
                                {!edit && currentUtl.name}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="property">הרשאות</TableCell>
                            <TableCell>
                                {UtlRoleToString[currentUtl.role]}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="property">
                                שם טורניר
                            </TableCell>
                            <TableCell>{currentUtl.tournament.name}</TableCell>
                        </TableRow>
                        {tableData && (
                            <>
                                <TableRow>
                                    <TableCell className="property">
                                        מיקום בטבלה
                                    </TableCell>
                                    <TableCell>{tableData.rank}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="property">
                                        נקודות
                                    </TableCell>
                                    <TableCell>{tableData.score}</TableCell>
                                </TableRow>
                            </>
                        )}
                        <TableRow>
                            <TableCell className="property"></TableCell>
                            <TableCell>
                                <Link
                                    onClick={goToMyBets}
                                    style={{ cursor: 'pointer' }}
                                >
                                    צפייה בהיומרים
                                </Link>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default MyUTL
