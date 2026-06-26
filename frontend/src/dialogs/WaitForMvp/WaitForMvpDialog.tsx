import React from 'react'
import { useTranslation } from 'react-i18next'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { Button } from '@mui/material'

interface Props {
    open: boolean
    onClose: () => void
    onConfirm: () => void
}

export default function WaitForMvpDialog({
    open,
    onClose,
    onConfirm,
}: Props) {
    const { t } = useTranslation('dialogs')

    return (
        <Dialog classes={{root: 'LB-WaitForMvpDialog'}} open={open} onClose={onClose}>
            <div>
                <DialogTitle>
                    <IconButton onClick={onClose} className={'closeButton'}>
                        <CloseIcon />
                    </IconButton>
                    {t('waitForMvp.title')}
                </DialogTitle>
                <DialogContent className={'dialogContent'}>
                    <h5>{t('waitForMvp.body1')}</h5>
                    <h5>{t('waitForMvp.body2')}</h5>
                    <div className='buttonContainer'>
                        <Button
                            variant='contained'
                            color='primary'
                            onClick={onConfirm}
                        >
                            {t('buttons.okGotIt')}
                        </Button>
                    </div>
                </DialogContent>
            </div>
        </Dialog>
    )
}
