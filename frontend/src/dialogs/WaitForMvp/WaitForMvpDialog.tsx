import React from 'react'
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

    return (
        <Dialog classes={{root: 'LB-WaitForMvpDialog'}} open={open} onClose={onClose}>
            <div>
                <DialogTitle>
                    <IconButton onClick={onClose} className={'closeButton'}>
                        <CloseIcon />
                    </IconButton>
                    רגע, זה עדיין לא נגמר...
                </DialogTitle>
                <DialogContent className={'dialogContent'}>
                    <h5>עדיין לא הוכרז מצטיין הטורניר, ולכן הניקוד שמוצג הוא עדיין לא הניקוד הסופי.</h5>
                    <h5>לאחר ההכרזה על מצטיין הטורניר (mvp), הניקוד יתעדכן ותוצג הטבלה הסופית.</h5>
                    <div className='buttonContainer'>
                        <Button
                            variant='contained'
                            color='primary'
                            onClick={onConfirm}
                        >
                            אוקיי, הבנתי
                        </Button>
                    </div>
                </DialogContent>
            </div>
        </Dialog>
    )
}
