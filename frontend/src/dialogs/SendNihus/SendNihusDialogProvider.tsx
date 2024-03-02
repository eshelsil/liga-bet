import React from 'react'
import { useSelector, connect } from 'react-redux'
import { DialogName, ToggleDialogStateFunction } from '../types'
import { closeDialog } from '../../_actions/dialogs'
import { NoSelector, IsOpenGameScoreInfoDialog, Games, FormattedMatchBetScoreConfig, IsOpenSendNihusDialog, Contestants, MatchesWithTeams, MatchBetsWithUserNames, MatchBetsLinked, CurrentTournamentId } from '@/_selectors'
import SendNihusDialog from './SendNihusDialog'
import useDialogData from '@/hooks/useDialogData'
import { valuesOf } from '@/utils'
import { sendNihus } from '@/api/nihusim'

interface Props {
    closeDialog: ToggleDialogStateFunction
}

function SendNihusDialogProvider({ closeDialog }: Props) {
    
    const onClose = () => {
        closeDialog(DialogName.SendNihus)
    }

    const isOpen = useSelector(IsOpenSendNihusDialog)
    const data = useDialogData(DialogName.SendNihus)
    const utlsById = useSelector(Contestants)
    const betsById = useSelector(MatchBetsLinked)
    const {gameId, targetUtlId} = data ?? {}
    const bet = valuesOf(betsById).find(bet => bet.relatedMatch.id === gameId);
    const targetUtl = utlsById[targetUtlId];
    const tournamentId = useSelector(CurrentTournamentId)
    if (!bet || !targetUtl) return null;


    const onSubmit = async () => {
        await sendNihus({tournamentId, gameId, targetUtlId, text: "nuhasta", gif: "mbappe"})
    }

    


    return (
        <SendNihusDialog
            open={isOpen}
            onClose={onClose}
            bet={bet}
            targetUtl={targetUtl}
            onSubmit={onSubmit}
        />
    )
}

const mapDispatchToProps = {
    closeDialog,
}

export default connect(
    NoSelector,
    mapDispatchToProps
)(SendNihusDialogProvider)
