import React, { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { Button } from '@mui/material'
import { BetType, NihusGrant, UtlRole } from '@/types'
import { cn, valuesOf } from '@/utils'
import { GumblerRow } from '@/gumblersList/GumblersList'
import NihusimItemContent from '@/appHeader/NihusimItemContent'
import { MatchResultV2 } from '@/widgets/MatchResult'
import { useSelector } from 'react-redux'
import { CurrentTournamentUser, MatchesWithTeams } from '@/_selectors'
import { LOCK_SCREEN_SECONDS } from '@/nihusim/NihusSticker'
import SendNihusDialog from '../SendNihus/SendNihusDialog'
import { fetchNihusGifs } from '@/api/nihusim'

interface Props {
    open: boolean
    onClose: () => void
    onConfirm: () => void
    grant?: NihusGrant
}

export default function NihusGrantExplanationDialog({
    open,
    onClose,
    onConfirm,
    grant,
}: Props) {
    const { t } = useTranslation('dialogs')
    const {amount, grant_reason} = grant ?? {};
    const currentUtl = useSelector(CurrentTournamentUser)
    const gamesById = useSelector(MatchesWithTeams)
    const exampleGame = valuesOf(gamesById)[0]
    const [nihusOpen, setNihusOpen] = useState(false)
    const [gifs, setGifs] = useState(null)
    const tournamentId = currentUtl?.tournament.id

    useEffect(()=>{
        if (gifs === null && tournamentId && open) {
            fetchNihusGifs(tournamentId).then(setGifs)
        }
    },[gifs, tournamentId])

    if (!exampleGame) return null;

    return (
        <Dialog classes={{paper: cn('tn-m-4')}} open={open} onClose={onClose}>
            <SendNihusDialog
                open={nihusOpen}
                onClose={() => setNihusOpen(false)}
                bet={{
                    id: -1,
                    relatedMatch: exampleGame,
                    result_home: 1,
                    result_away: 1,
                    winner_side: null,
                    score: null,
                    user_tournament_id: -1,
                    type_id: -1,
                    type: BetType.Match,
                }}
                targetUtl={{id: -1, name: t('nihus.exampleUserName'), user_id: -1, role: UtlRole.Contestant}}
                gifs={gifs ? gifs : []}
                currentUtl={currentUtl}
            />
            <div>
                <DialogTitle>
                    <IconButton onClick={onClose} className={cn("absolute start-2 top-2")}>
                        <CloseIcon />
                    </IconButton>
                    {!!grant ? t('nihus.titleGranted', { amount }) : t('nihus.titleExplanation')}
                </DialogTitle>
                <DialogContent className={'dialogContent'}>
                    {!!grant && (<>
                        <h4 className={cn("mt-0")}><Trans i18nKey="nihus.grantedHeading" t={t} values={{ amount }} components={{ 1: <br/> }} /></h4>
                        <h5><span className={cn("underline")}>{t('nihus.grantReasonLabel')}</span> <span className={cn("text-md me-1")}>{grant_reason}</span></h5>
                    </>)}
                    <div className={cn("mt-5", {'mt-0': !grant})}>
                        <h5 className={cn("mb-1")}>{t('nihus.howToIntro')}</h5>
                        <div className={cn("flex items-center border-t border-b border-solid border-black/20 gap-2")}>
                            {exampleGame && (
                                <MatchResultV2 
                                    home={{team: exampleGame.home_team, score: 2}}
                                    away={{team: exampleGame.away_team, score: 1}}
                                    isKnockout={false}
                                />
                            )}
                            <GumblerRow gumbler={{id: -1, name: t('nihus.exampleUserName')}} showNihusable onNihusClick={() => setNihusOpen(true)}/>
                        </div>
                        <h5 className={cn("italic pe-3")}><Trans i18nKey="nihus.lockWarning" t={t} values={{ seconds: LOCK_SCREEN_SECONDS }} components={{ 1: <span className={cn("underline")} />, 3: <b /> }} /></h5>
                    </div>
                    <div className={cn("mt-5")}>
                        <h5 className={cn("mb-0")}>{t('nihus.toggleOffInfo')}</h5>
                        <div className={cn("pointer-events-none bg-primaryGradient px-4 py-2 w-[200px] text-white")}>
                            <NihusimItemContent />
                        </div>
                        <h5 className={cn("pe-3 italic")}>{t('nihus.menuInfo')}</h5>
                    </div>

                    <h5 className={cn("font-bold mt-4 mb-0")}>{t('nihus.outro1')}</h5>
                    <h5 className={cn("font-bold m-0 mt-1")}>{t('nihus.outro2')}</h5>
                    <div className={cn('mt-6 flex items-center justify-center')}>
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
