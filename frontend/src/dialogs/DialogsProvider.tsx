import React from 'react'
import SetPasswordDialog from './changePassword/SetPasswordDialogProvider'
import MultiBetExplanationDialog from './MultiBet/MultiBetExplanationDialogProvider'
import WaitForMvpDialog from './WaitForMvp/WaitForMvpDialogProvider'
import GameScoreInfoDialog from './GameScoreInfo/GameScoreInfoDialogProvider'
import NihusExplanationDialog from './NihusExplanation/NihusExplanationDialogProvider'
import SendNihusDialog from './SendNihus/SendNihusDialogProvider'

export default function DialogsProvider() {
    return (
        <>
            <SetPasswordDialog />
            <MultiBetExplanationDialog />
            <WaitForMvpDialog />
            <GameScoreInfoDialog />
            <NihusExplanationDialog />
            <SendNihusDialog />
        </>
    )
}
