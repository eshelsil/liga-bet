import React, { useEffect, useState } from 'react'
import { useSelector, connect } from 'react-redux'
import { DialogName, ToggleDialogStateFunction } from '../types'
import { closeDialog } from '../../_actions/dialogs'
import { NoSelector, IsOpenGameScoreInfoDialog, Games, FormattedMatchBetScoreConfig, IsOpenSendNihusDialog, Contestants, MatchesWithTeams, MatchBetsWithUserNames, MatchBetsLinked, CurrentTournamentId, CurrentTournamentUser } from '@/_selectors'
import SendNihusDialog from './SendNihusDialog'
import useDialogData from '@/hooks/useDialogData'
import { valuesOf } from '@/utils'
import { SendNihusParams, fetchNihusGifs, sendNihus } from '@/api/nihusim'
import { sendAndStoreNihus } from '@/_actions/nihusim'

interface Props {
    closeDialog: ToggleDialogStateFunction
    sendAndStoreNihus: (params: SendNihusParams) => void
}


function SendNihusDialogProvider({ closeDialog, sendAndStoreNihus }: Props) {
    
    const onClose = () => {
        closeDialog(DialogName.SendNihus)
    }
    const [gifs, setGifs] = useState(null)

    const isOpen = useSelector(IsOpenSendNihusDialog)
    const data = useDialogData(DialogName.SendNihus)
    const utlsById = useSelector(Contestants)
    const currentUtl = useSelector(CurrentTournamentUser)
    const betsById = useSelector(MatchBetsLinked)
    const {gameId, targetUtlId} = data ?? {}
    const bet = valuesOf(betsById).find(bet => bet.relatedMatch.id === gameId);
    const targetUtl = utlsById[targetUtlId];
    const tournamentId = useSelector(CurrentTournamentId)

    useEffect(()=>{
        if (isOpen && gifs === null) {
            fetchNihusGifs(tournamentId).then(setGifs)
        }
    },[isOpen, gifs])


    const onSubmit = async (text: string, gif: string) => {
        await sendAndStoreNihus({tournamentId, gameId, targetUtlId, text, gif})
    }
    if (!bet || !targetUtl) return null;


    


    return (
        <SendNihusDialog
            open={isOpen}
            onClose={onClose}
            bet={bet}
            targetUtl={targetUtl}
            onSubmit={onSubmit}
            gifs={gifs ? gifs : []}
            currentUtl={currentUtl}
        />
    )
}

const mapDispatchToProps = {
    closeDialog,
    sendAndStoreNihus,
}

export default connect(
    NoSelector,
    mapDispatchToProps
)(SendNihusDialogProvider)
