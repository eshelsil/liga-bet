import React from 'react'
import { LoadingButton } from '../widgets/Buttons'

interface Props {
    action: () => Promise<void>
}

export function MakeManagerButton({ action }: Props) {
    return (
        <LoadingButton size='small' variant="contained" color="primary" action={action}>
            הפוך לעוזר מנהל{' '}
        </LoadingButton>
    )
}

export function RemoveManagerButton({ action }: Props) {
    return (
        <LoadingButton size='small' variant="contained" color="secondary" action={action}>
            {' '}
            הסר הרשאות עוזר מנהל{' '}
        </LoadingButton>
    )
}

export function ConfirmUtlButton({ action }: Props) {
    return (
        <LoadingButton variant="contained" color="success" action={action}>
            {' '}
            אשר משתתף{' '}
        </LoadingButton>
    )
}

export function RemoveUtlButton({ action }: Props) {
    return (
        <LoadingButton size='small' variant="contained" color="error" action={action}>
            {' '}
            מחק משתתף{' '}
        </LoadingButton>
    )
}
