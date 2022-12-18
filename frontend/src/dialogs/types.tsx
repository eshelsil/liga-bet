export enum DialogName {
    ChangePassword = 'change_password',
    MultiBetExplanation = 'multiBetExplanation',
    WaitForMvp = 'waitForMvp',
}

export type ToggleDialogStateFunction = (name: DialogName) => void
