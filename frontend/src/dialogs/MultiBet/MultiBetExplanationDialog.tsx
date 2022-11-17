import React, { useState } from 'react'
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
                    שליחת ניחוש לכל הטורנירים שלך
                </DialogTitle>
                <DialogContent className={'dialogContent'}>
                    <h5>ניתן לשלוח ניחוש מסוים לכל הטורנירים בהם אתה משתתף</h5>
                    <h5 style={{marginTop: -6}}>בעזרת המתג מצד שמאל למעלה שמופיע בזמן עריכת הניחוש:</h5>
                    <div className={`LB-EditableBetView ${tournamentClass} sendingforAllTournaments`}>
                        <div className={`EditableBetView-header`}>
                            <Switch
                                className='forAllTournamentsInput'
                                checked={true}
                            />
                        </div>
                    </div>
                    <h5>כשהמתג <span><b>דלוק</b></span> הרקע של הכותרת יהיה סגול ובלחיצה על "שלח" הניחוש יישלח <span><b>לכל הטורנירים</b></span></h5>
                    <div className={`LB-EditableBetView ${tournamentClass}`}>
                        <div className={`EditableBetView-header`}>
                            <Switch
                                className='forAllTournamentsInput'
                                checked={false}
                            />
                        </div>
                    </div>
                    <h5>כשהמתג <span><b>כבוי</b></span> הרקע של הכותרת יהיה בצבע של הטורניר הנוכחי ובלחיצה על "שלח" הניחוש יישלח רק <span><b>לטורניר הנוכחי</b></span></h5>
                    <h5 style={{marginTop: 32}}>אפשר להגדיר ברירת מחדל למצב ההתחלתי של המתג:</h5>
                    <div style={{marginBottom: 12}}>
                        <MultiBetsSettingsView
                            pinned={true}
                            togglePinned={() => null}
                            forAllTournaments={true}
                            setForAllTournaments={() => null}
                            onInfoClick={() => null}
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
                            label="הבנתי, אל תציג שוב"
                            
                        />
                        <div className='buttonContainer'>
                            <Button
                                variant='contained'
                                color='primary'
                                onClick={close}
                            >
                                אוקיי
                            </Button>
                        </div>
                    </>)}

                </DialogContent>
            </div>
        </Dialog>
    )
}
