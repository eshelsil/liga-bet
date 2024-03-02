import { useAppDispatch } from '@/_helpers/store';
import dialogsDataSlice, { DialogsDataRecord, SetDialogDataPayload } from '@/_reducers/dialogsData';
import dialogsSlice from '@/_reducers/dialogs';
import { DialogName } from '@/dialogs/types';

type DialogData<T> = T extends keyof DialogsDataRecord
    ? DialogsDataRecord[T]
    : undefined;

function useOpenDialog<T extends DialogName>(dialog: T) {
    const dispatch = useAppDispatch();
    const openDialog = (data: DialogData<T>) => {
        if (data) {
            dispatch(
                dialogsDataSlice.actions.setData({
                    dialog,
                    data,
                } as SetDialogDataPayload),
            );
        }
        dispatch(dialogsSlice.actions.openDialog(dialog));
    };
    return openDialog;
}

export default useOpenDialog;
