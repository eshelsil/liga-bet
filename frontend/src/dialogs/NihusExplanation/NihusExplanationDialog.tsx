import React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { Button } from '@mui/material'
import { NihusGrant } from '@/types'
import { cn } from '@/utils'

interface Props {
    open: boolean
    onClose: () => void
    onConfirm: () => void
    grant: NihusGrant
}

export default function NihusGrantExplanationDialog({
    open,
    onClose,
    onConfirm,
    grant,
}: Props) {
    const {amount, grant_reason} = grant;
    return (
        <Dialog classes={{root: cn('tn-m-12')}} open={open} onClose={onClose}>
            <div>
                <DialogTitle>
                    <IconButton onClick={onClose} className={cn("absolute left-2 top-2")}>
                        <CloseIcon />
                    </IconButton>
                    ברכות זכית ב-{amount} ניחוסים!
                </DialogTitle>
                <DialogContent className={'dialogContent'}>
                    <h4>הפיצ'ר הסודי כבר כאן! ואתה זכית להשתמש בו {amount} פעמים</h4>
                    <h5 className={cn("underline")}>הזכייה הוענקה לך בעקבות:</h5>
                    <p className={cn("text-xs mr-4")}>{grant_reason}</p>
                    <div className={cn('mt-10 flex items-center justify-center')}>
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
