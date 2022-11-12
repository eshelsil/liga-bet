import React from 'react'
import SetPasswordDialog from './changePassword/SetPasswordDialogProvider'
import MultiBetExplanationDialog from './MultiBet/MultiBetExplanationDialogProvider'

export default function DialogsProvider() {
    return (
        <>
            <SetPasswordDialog />
            <MultiBetExplanationDialog />
        </>
    )
}
