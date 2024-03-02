import React, { useEffect } from 'react'
import { useSelector, connect } from 'react-redux'
import { DialogName, ToggleDialogStateFunction } from '../types'
import { closeDialog, } from '../../_actions/dialogs'
import { NoSelector, UnseenNihusGrant, IsOpenNihusGrantExplanationDialog } from '../../_selectors'
import NihusExplanationDialog from './NihusExplanationDialog'
import useOpenDialog from '@/hooks/useOpenDialog'
import { markSeenNihusGrant } from '@/_actions/nihusim'

interface Props {
    closeDialog: ToggleDialogStateFunction
    markAsSeen: (grantId: number) => void
}

function NihusExplanationDialogProvider({ closeDialog, markAsSeen }: Props) {
    
    const openDialog = useOpenDialog(DialogName.NihusGrantExplanation)
    const isOpen = useSelector(IsOpenNihusGrantExplanationDialog)
    const unseenGrant = useSelector(UnseenNihusGrant)
    const onClose = () => {
        closeDialog(DialogName.NihusGrantExplanation)
    }
    const onConfirm = () => {
        onClose()
        markAsSeen(unseenGrant?.id)
    }

    useEffect(()=> {
        if (unseenGrant) {
            openDialog(undefined)
        }
    }, [unseenGrant])
    if (!unseenGrant) return null;


    return (
        <NihusExplanationDialog
            open={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            grant={unseenGrant}
        />
    )
}

const mapDispatchToProps = {
    closeDialog,
    markAsSeen: markSeenNihusGrant,
}

export default connect(
    NoSelector,
    mapDispatchToProps
)(NihusExplanationDialogProvider)
