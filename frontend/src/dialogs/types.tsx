export enum DialogName {
    ChangePassword = 'change_password',
    MultiBetExplanation = 'multiBetExplanation',
    WaitForMvp = 'waitForMvp',
    GameScoreInfo = 'gameScoreInfoDialog',
}

export type ToggleDialogStateFunction = (name: DialogName) => void
