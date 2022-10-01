export enum DialogName {
    ChangePassword = 'change_password',
}


export type ToggleDialogStateFunction = (name: DialogName) => void