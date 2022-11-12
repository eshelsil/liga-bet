import React, { useEffect } from 'react'
import { useSelector, connect } from 'react-redux'
import { DialogName, ToggleDialogStateFunction } from '../types'
import { closeDialog, openDialog } from '../../_actions/dialogs'
import { NoSelector, IsOpenMultiBetExplanationDialog, AutoShowMultiBetExplanationDialog } from '../../_selectors'
import MultiBetExplanationDialog from './MultiBetExplanationDialog'
import { updateDontShowAgainMultiBetExplanation, updateSeenMultiBetExplanationDialog } from '../../_actions/multiBetsSettings'
import './style.scss'

interface Props {
    closeDialog: ToggleDialogStateFunction
    openDialog: ToggleDialogStateFunction
    updateDontShowAgain: (value: boolean) => void
    markAsSeen: () => void
}

function MultiBetExplanationDialogProvider({ openDialog, closeDialog, updateDontShowAgain, markAsSeen }: Props) {
    
    const shouldAutoShow = useSelector(AutoShowMultiBetExplanationDialog)
    const isOpen = useSelector(IsOpenMultiBetExplanationDialog)
    const onClose = () => {
        closeDialog(DialogName.MultiBetExplanation)
        markAsSeen()
    }

    useEffect(()=> {
        if (shouldAutoShow) {
            openDialog(DialogName.MultiBetExplanation)
        }
    }, [shouldAutoShow])


    return (
        <MultiBetExplanationDialog
            open={isOpen}
            onClose={onClose}
            onDontShowAgain={() => updateDontShowAgain(true)}
            isAutoShown={shouldAutoShow}
        />
    )
}

const mapDispatchToProps = {
    closeDialog,
    openDialog,
    updateDontShowAgain: updateDontShowAgainMultiBetExplanation,
    markAsSeen: updateSeenMultiBetExplanationDialog,
}

export default connect(
    NoSelector,
    mapDispatchToProps
)(MultiBetExplanationDialogProvider)
