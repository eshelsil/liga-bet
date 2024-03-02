import { GameBetScoreConfig } from '@/types'

export const gameBetSliceToString: Record<keyof GameBetScoreConfig, string> = {
    qualifier: 'מעפילה',
    winnerSide: 'הצד המנצח',
    result: 'תוצאה מדויקת',
}

export function getHebBetSliceName(type: keyof GameBetScoreConfig){

    return gameBetSliceToString[type] ?? type
}