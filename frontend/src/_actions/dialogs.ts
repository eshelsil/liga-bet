import { DialogName } from '../dialogs/types';
import { AppDispatch } from '../_helpers/store';
import dialogsSlice from '../_reducers/dialogs';


function openDialog(name: DialogName) {
  return (dispatch: AppDispatch) => {
    dispatch(dialogsSlice.actions.openDialog(name));
  }
}

function closeDialog(name: DialogName) {
  return (dispatch: AppDispatch) => {
    dispatch(dialogsSlice.actions.closeDialog(name));
  }
}

export {
  openDialog,
  closeDialog,
}