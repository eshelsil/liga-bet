import React, { useEffect } from 'react'
import { useSelector, connect } from 'react-redux'
import { DialogName, ToggleDialogStateFunction } from '../types'
import { closeDialog, openDialog } from '../../_actions/dialogs'
import { NoSelector, IsOpenDialogChangePassword } from '../../_selectors'
import { updatePassword } from '../../api/users'
import { useLocation, useHistory } from 'react-router-dom'
import SetPasswordDialog from './SetPasswordDialog'

interface Props {
    closeDialog: ToggleDialogStateFunction
    openDialog: ToggleDialogStateFunction
}

function SetPasswordDialogProvider({ closeDialog, openDialog }: Props) {
    const location = useLocation();
    const history = useHistory();
    const params = new URLSearchParams(location.search)
    const redirectedFromResetPwLink = params.has('reset-password') 
    
    const isOpen = useSelector(IsOpenDialogChangePassword)
    const onClose = () => closeDialog(DialogName.ChangePassword)

    useEffect(()=> {
        if (redirectedFromResetPwLink){
            openDialog(DialogName.ChangePassword)
            history.push('/')
        }
    }, [redirectedFromResetPwLink])

    return (
        <SetPasswordDialog
            open={isOpen}
            onClose={onClose}
            setPassword={updatePassword}
        />
    )
}

const mapDispatchToProps = {
    closeDialog,
    openDialog,
}

export default connect(
    NoSelector,
    mapDispatchToProps
)(SetPasswordDialogProvider)
