export enum DialogName {
    ChangePassword = 'change_password',
    MultiBetExplanation = 'multiBetExplanation',
}

export type ToggleDialogStateFunction = (name: DialogName) => void
