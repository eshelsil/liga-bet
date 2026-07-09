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
    resultPoints?: number // exact-score points for the round (result tournaments only)
    role: SpecialRole | 'any' // a pre-selected team (Winner/Runner-Up) plays here → show its advance bonus
    isBettingAgainst?: boolean // true if the user is betting against their pre-selected team (Winner/Runner-Up) in this game
}

// Explains how a single bracket qualifier bet is scored: qualifier points for the round,
// plus the advance bonus when one of the user's pre-selected teams plays in this tie.
function BracketGameScoreInfoDialog({
    open,
    onClose,
    qualifierPoints,
    advancePoints,
    resultPoints = 0,
    role,
    isBettingAgainst = false,
}: Props) {
    const { t } = useTranslation('knockout_bracket')
    const roleLabel =
        role === 'winner' ? t('special.winner') : role === 'runnerUp' ? t('special.runnerUp') : t('special.anyFinalist')

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
                {resultPoints > 0 && (
                    <p className="BracketScoreInfo-row">
                        <span className="font-bold underline">
                            {t('card.info.result.title')}
                        </span>
                        <span>
                            {' '}
                            {t('card.info.result.description', {
                                points: resultPoints,
                            })}
                        </span>
                    </p>
                )}
                {role && (
                    <p className="BracketScoreInfo-row">
                        <span className="font-bold underline">
                            <b>{t('card.info.bonus.title', {
                                role: roleLabel,
                            })}</b>
                        </span>
                        <span>
                            {' '}
                            {t('card.info.bonus.description', {
                                points: advancePoints,
                                role: roleLabel,
                                bonusSign: isBettingAgainst ? '' : '+',
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
