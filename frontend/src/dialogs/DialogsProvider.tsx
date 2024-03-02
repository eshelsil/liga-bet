import React from 'react'
import SetPasswordDialog from './changePassword/SetPasswordDialogProvider'
import MultiBetExplanationDialog from './MultiBet/MultiBetExplanationDialogProvider'
import WaitForMvpDialog from './WaitForMvp/WaitForMvpDialogProvider'
import GameScoreInfoDialog from './GameScoreInfo/GameScoreInfoDialogProvider'

export default function DialogsProvider() {
    return (
        <>
            <SetPasswordDialog />
            <MultiBetExplanationDialog />
            <WaitForMvpDialog />
            <GameScoreInfoDialog />
        </>
    )
}
