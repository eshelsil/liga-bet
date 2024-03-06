export enum DialogName {
    ChangePassword = 'change_password',
    MultiBetExplanation = 'multiBetExplanation',
    NihusGrantExplanation = 'nihusGrantExplanation',
    SendNihus = 'sendNihus',
    WaitForMvp = 'waitForMvp',
    GameScoreInfo = 'gameScoreInfo',
    NihusSticker = 'NihusSticker',
}

export type ToggleDialogStateFunction = (name: DialogName) => void
