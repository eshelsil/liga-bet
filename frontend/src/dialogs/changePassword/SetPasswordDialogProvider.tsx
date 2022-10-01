import React from 'react';
import { useSelector, connect } from 'react-redux';
import { DialogName, ToggleDialogStateFunction } from '../types';
import { closeDialog } from '../../_actions/dialogs';
import { NoSelector, IsOpenDialogChangePassword } from '../../_selectors';
import SetPasswordDialog from './SetPasswordDialog';


interface Props {
  closeDialog: ToggleDialogStateFunction,
  setPassword: any,
}

function SetPasswordDialogProvider({
  setPassword,
  closeDialog,
}: Props){
	const isOpen = useSelector(IsOpenDialogChangePassword);
  const onClose = () => closeDialog(DialogName.ChangePassword);

	return (
		<SetPasswordDialog
			open={isOpen}
			onClose={onClose}
			setPassword={setPassword}
		/>
	);
}

const mapDispatchToProps = {
	setPassword: () =>{alert('setPassword')},
  	closeDialog,
}


export default connect(NoSelector, mapDispatchToProps)(SetPasswordDialogProvider);