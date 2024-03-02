import React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { Button } from '@mui/material'
import { cn, getGameScoreConfig, getGameStage, keysOf, sortBetSlices } from '@/utils'
import { GameBetScoreConfig, MatchApiModel, MatchBetWithRelations, MatchBetsScoreConfig, MatchCommonBase, UTL } from '@/types'
import { getHebBetSliceName, getHebStageName } from '@/strings'



interface Props {
    open: boolean
    onClose: () => void
    bet: MatchBetWithRelations
    targetUtl: UTL
    onSubmit: () => Promise<void>
}



export default function SendNihusDialog({
    open,
    onClose,
    onSubmit,
    bet,
    targetUtl,
}: Props) {
    return (
        <Dialog classes={{root: cn('tn-m-3')}} open={open} onClose={onClose}>
            
            <div className={cn("w-[400px] max-w-full")}>
                <DialogTitle>
                    <IconButton onClick={onClose} className={cn("absolute top-2 left-2")}>
                        <CloseIcon />
                    </IconButton>
                    שלח ניחוש
                </DialogTitle>
                <DialogContent>
                    
                    <div className={cn('mt-10')}>
                        <Button
                            variant='contained'
                            color='primary'
                            onClick={onSubmit}
                        >
                            שלח
                        </Button>
                    </div>
                </DialogContent>
            </div>
        </Dialog>
    )
}
