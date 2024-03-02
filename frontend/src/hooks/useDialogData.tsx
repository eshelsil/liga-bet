import { useSelector } from 'react-redux';
import { DialogsData } from '@/_selectors';
import { DialogsDataRecord } from '@/_reducers/dialogsData';


function useDialogData<T extends keyof DialogsDataRecord>(dialog: T) {
    const dialogsData = useSelector(DialogsData);
    return dialogsData[dialog];
}

export default useDialogData;
