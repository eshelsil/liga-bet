import React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { TournamentScoreConfig } from '../../../types'
import ScoreConfigFormView from '../../../tournamentConfig/scores/ScoreConfigForm'
import { formatTopAssistsConfig } from '../../../utils'

interface Props {
    open: boolean
    onClose: () => void
    name: string,
    config: TournamentScoreConfig
}

export default function TournamentConfigDialog({
    open,
    onClose,
    name,
    config,
}: Props) {
    const formattedConfig = {
        ...config,
        specialBets: {
            ...config.specialBets,
            topAssists: formatTopAssistsConfig(config.specialBets.topAssists)
        }
    }

    return (
        <Dialog classes={{root: 'LB-MultiBetExplanationDialog'}} open={open} onClose={onClose} style={{borderRadius: 16}}>
            <DialogContent>
                <DialogTitle>
                    <IconButton onClick={onClose} className={'closeButton'}>
                        <CloseIcon />
                    </IconButton>
                    הגדרות ניקוד לטורניר "{name}"
                </DialogTitle>
                <ScoreConfigFormView config={formattedConfig} />
            </DialogContent>
        </Dialog>
    )
}
