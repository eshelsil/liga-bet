import React from 'react'
import { useSelector, connect } from 'react-redux'
import { DialogName, ToggleDialogStateFunction } from '../types'
import { closeDialog } from '../../_actions/dialogs'
import { NoSelector, IsOpenWaitForMvpDialog } from '../../_selectors'
import WaitForMvpDialog from './WaitForMvpDialog'
import './style.scss'

interface Props {
    closeDialog: ToggleDialogStateFunction
}

function WaitForMvpDialogProvider({ closeDialog }: Props) {
    
    const seen = localStorage.getItem('ligaBetSeenWaitForMvpMsg')
    const isOpen = useSelector(IsOpenWaitForMvpDialog)
    const onClose = () => {
        closeDialog(DialogName.WaitForMvp)
    }

    const onConfirm = () => {
        localStorage.setItem('ligaBetSeenWaitForMvpMsg', '1')
        onClose()
    }


    return (
        <WaitForMvpDialog
            open={isOpen && !seen}
            onClose={onClose}
            onConfirm={onConfirm}
        />
    )
}

const mapDispatchToProps = {
    closeDialog,
}

export default connect(
    NoSelector,
    mapDispatchToProps
)(WaitForMvpDialogProvider)
