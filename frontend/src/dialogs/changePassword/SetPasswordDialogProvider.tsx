import React from 'react';
import { useSelector, connect } from 'react-redux';
import { DialogName, ToggleDialogStateFunction } from '../types';
import { closeDialog } from '../../_actions/dialogs';
import { NoSelector, IsOpenDialogChangePassword } from '../../_selectors';
import { updatePassword } from '../../api/users';
import SetPasswordDialog from './SetPasswordDialog';


interface Props {
  closeDialog: ToggleDialogStateFunction,
}

function SetPasswordDialogProvider({
  closeDialog,
}: Props){
	const isOpen = useSelector(IsOpenDialogChangePassword);
  	const onClose = () => closeDialog(DialogName.ChangePassword);

	return (
		<SetPasswordDialog
			open={isOpen}
			onClose={onClose}
			setPassword={updatePassword}
		/>
	);
}

const mapDispatchToProps = {
  	closeDialog,
}


export default connect(NoSelector, mapDispatchToProps)(SetPasswordDialogProvider);