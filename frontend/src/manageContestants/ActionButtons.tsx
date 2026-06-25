import React from 'react'
import { useTranslation } from 'react-i18next'
import { LoadingButton } from '../widgets/Buttons'

interface Props {
    action: () => Promise<void>
}

export function MakeManagerButton({ action }: Props) {
    const { t } = useTranslation('manageContestants')
    return (
        <LoadingButton size='small' variant="contained" color="primary" action={action}>
            {t('buttons.makeManager')}{' '}
        </LoadingButton>
    )
}

export function RemoveManagerButton({ action }: Props) {
    const { t } = useTranslation('manageContestants')
    return (
        <LoadingButton size='small' variant="contained" color="secondary" action={action}>
            {' '}
            {t('buttons.removeManager')}{' '}
        </LoadingButton>
    )
}

export function ConfirmUtlButton({ action }: Props) {
    const { t } = useTranslation('manageContestants')
    return (
        <LoadingButton variant="contained" color="success" action={action}>
            {' '}
            {t('buttons.confirmUtl')}{' '}
        </LoadingButton>
    )
}

export function RemoveUtlButton({ action }: Props) {
    const { t } = useTranslation('manageContestants')
    return (
        <LoadingButton size='small' variant="contained" color="error" action={action}>
            {' '}
            {t('buttons.removeUtl')}{' '}
        </LoadingButton>
    )
}
