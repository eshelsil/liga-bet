import React from 'react'
import { Button } from '@mui/material'

interface Props {
    action: () => void
}

export function MakeManagerButton({ action }: Props) {
    return (
        <Button size='small' variant="contained" color="primary" onClick={action}>
            {' '}
            הפוך למנהל{' '}
        </Button>
    )
}

export function RemoveManagerButton({ action }: Props) {
    return (
        <Button size='small' variant="contained" color="secondary" onClick={action}>
            {' '}
            הסר הרשאות מנהל{' '}
        </Button>
    )
}

export function ConfirmUtlButton({ action }: Props) {
    return (
        <Button variant="contained" color="success" onClick={action}>
            {' '}
            אשר משתתף{' '}
        </Button>
    )
}

export function RemoveUtlButton({ action }: Props) {
    return (
        <Button size='small' variant="contained" color="error" onClick={action}>
            {' '}
            מחק משתתף{' '}
        </Button>
    )
}
