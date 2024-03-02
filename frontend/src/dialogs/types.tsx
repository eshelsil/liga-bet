export enum DialogName {
    ChangePassword = 'change_password',
    MultiBetExplanation = 'multiBetExplanation',
    NihusGrantExplanation = 'nihusGrantExplanation',
    SendNihus = 'sendNihus',
    WaitForMvp = 'waitForMvp',
    GameScoreInfo = 'gameScoreInfo',
}

export type ToggleDialogStateFunction = (name: DialogName) => void
