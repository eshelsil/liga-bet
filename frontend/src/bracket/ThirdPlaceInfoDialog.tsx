import React from 'react'
import { useTranslation } from 'react-i18next'
import { Dialog, DialogContent, DialogTitle } from '@mui/material'

interface Props {
    open: boolean
    onClose: () => void
}

// Explains how third-place qualifiers are slotted (the "3·ABCDF" tokens).
function ThirdPlaceInfoDialog({ open, onClose }: Props) {
    const { t } = useTranslation('knockout_bracket')
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs">
            <DialogTitle>{t('thirdPlace.title')}</DialogTitle>
            <DialogContent>
                <p>{t('thirdPlace.body1')}</p>
                <p>{t('thirdPlace.body2')}</p>
            </DialogContent>
        </Dialog>
    )
}

export default ThirdPlaceInfoDialog
