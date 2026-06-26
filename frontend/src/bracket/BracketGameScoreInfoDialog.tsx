import React from 'react'
import { useTranslation } from 'react-i18next'
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

type SpecialRole = 'winner' | 'runnerUp' | null

interface Props {
    open: boolean
    onClose: () => void
    qualifierPoints: number
    advancePoints: number
    role: SpecialRole // a pre-selected team (Winner/Runner-Up) plays here → show its advance bonus
}

// Explains how a single bracket qualifier bet is scored: qualifier points for the round,
// plus the advance bonus when one of the user's pre-selected teams plays in this tie.
function BracketGameScoreInfoDialog({
    open,
    onClose,
    qualifierPoints,
    advancePoints,
    role,
}: Props) {
    const { t } = useTranslation('knockout_bracket')
    const roleLabel =
        role === 'winner' ? t('special.winner') : t('special.runnerUp')

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle className="BracketScoreInfo-title">
                <span>{t('card.info.title')}</span>
                <IconButton size="small" onClick={onClose}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>
            <DialogContent className="LB-BracketScoreInfo">
                <p className="BracketScoreInfo-row">
                    <span className="font-bold underline">
                        {t('card.info.qualifier.title')}
                    </span>
                    <span>
                        {' '}
                        {t('card.info.qualifier.description', {
                            points: qualifierPoints,
                        })}
                    </span>
                </p>
                {role && (
                    <p className="BracketScoreInfo-row">
                        <span className="font-bold underline">
                            <b>{t('card.info.bonus.title')}</b>
                        </span>
                        <span>
                            {' '}
                            {t('card.info.bonus.description', {
                                points: advancePoints,
                                role: roleLabel,
                            })}
                        </span>
                    </p>
                )}
                <div className="BracketScoreInfo-actions">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={onClose}
                    >
                        {t('card.info.ok')}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default BracketGameScoreInfoDialog
