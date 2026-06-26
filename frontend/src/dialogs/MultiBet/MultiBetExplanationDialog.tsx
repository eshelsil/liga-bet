import React, { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { Button, Checkbox, FormControlLabel, Switch } from '@mui/material'
import { useTournamentThemeClass } from '../../hooks/useThemeClass'
import MultiBetsSettingsView from '../../multiBetsSettings/MultiBetsSettingsView'

interface Props {
    open: boolean
    onClose: () => void
    onDontShowAgain: () => void
    isAutoShown: boolean
}

export default function MultiBetExplanationDialog({
    open,
    onClose,
    onDontShowAgain,
    isAutoShown,
}: Props) {

    const { t } = useTranslation('dialogs')
    const [dontShowAgain, setDontShowAgain] = useState(false)
    const tournamentClass = useTournamentThemeClass()

    const close = () => {
        onClose()
        if (dontShowAgain){
            onDontShowAgain()
        }
    }


    return (
        <Dialog classes={{root: 'LB-MultiBetExplanationDialog'}} open={open} onClose={close}>
            <div>
                <DialogTitle>
                    <IconButton onClick={close} className={'closeButton'}>
                        <CloseIcon />
                    </IconButton>
                    {t('multiBet.title')}
                </DialogTitle>
                <DialogContent className={'dialogContent'}>
                    <h5>{t('multiBet.intro1')}</h5>
                    <h5 style={{marginTop: -6}}>{t('multiBet.intro2')}</h5>
                    <div className={`LB-EditableBetView ${tournamentClass} sendingforAllTournaments`}>
                        <div className={`EditableBetView-header`}>
                            <Switch
                                className='forAllTournamentsInput'
                                checked={true}
                            />
                        </div>
                    </div>
                    <h5><Trans i18nKey="multiBet.switchOn" t={t} components={{ 1: <span />, 2: <b />, 3: <span />, 4: <b /> }} /></h5>
                    <div className={`LB-EditableBetView ${tournamentClass}`}>
                        <div className={`EditableBetView-header`}>
                            <Switch
                                className='forAllTournamentsInput'
                                checked={false}
                            />
                        </div>
                    </div>
                    <h5><Trans i18nKey="multiBet.switchOff" t={t} components={{ 1: <span />, 2: <b />, 3: <span />, 4: <b /> }} /></h5>
                    <h5 style={{marginTop: 32}}>{t('multiBet.defaultStateLabel')}</h5>
                    <div style={{marginBottom: 12}}>
                        <MultiBetsSettingsView
                            pinned={true}
                            setPinned={() => null}
                            forAllTournaments={true}
                            setForAllTournaments={() => null}
                        />
                    </div>
                    {isAutoShown && (<>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    size='medium'
                                    checked={dontShowAgain}
                                    onChange={(e, value: boolean) => setDontShowAgain(value)}
                                />
                            }
                            label={t('multiBet.dontShowAgain')}

                        />
                        <div className='buttonContainer'>
                            <Button
                                variant='contained'
                                color='primary'
                                onClick={close}
                            >
                                {t('buttons.ok')}
                            </Button>
                        </div>
                    </>)}

                </DialogContent>
            </div>
        </Dialog>
    )
}
