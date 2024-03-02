import React from 'react'
import { useSelector, connect } from 'react-redux'
import { DialogName, ToggleDialogStateFunction } from '../types'
import { closeDialog } from '../../_actions/dialogs'
import { NoSelector, IsOpenGameScoreInfoDialog, Games, FormattedMatchBetScoreConfig } from '@/_selectors'
import GameScoreInfoDialog from './GameScoreInfoDialog'
import useDialogData from '@/hooks/useDialogData'

interface Props {
    closeDialog: ToggleDialogStateFunction
}

function GameScoreInfoDialogProvider({ closeDialog }: Props) {
    
    const onClose = () => {
        closeDialog(DialogName.GameScoreInfo)
    }

    const isOpen = useSelector(IsOpenGameScoreInfoDialog)
    const data = useDialogData(DialogName.GameScoreInfo)
    const scoreConfig = useSelector(FormattedMatchBetScoreConfig)
    const {gameId} = data ?? {}
    const gamesById = useSelector(Games)
    const game = gamesById[gameId]
    if (!game || !scoreConfig) return null;
    


    return (
        <GameScoreInfoDialog
            open={isOpen}
            onClose={onClose}
            game={game}
            scoreConfig={scoreConfig}
        />
    )
}

const mapDispatchToProps = {
    closeDialog,
}

export default connect(
    NoSelector,
    mapDispatchToProps
)(GameScoreInfoDialogProvider)
