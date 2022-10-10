import { MatchRuleType } from '../types'

export const matchRuleToString = {
    [MatchRuleType.WinnerSide]: 'מנצחת (1X2)',
    [MatchRuleType.Result]: 'תוצאה מדויקת',
    [MatchRuleType.Qualifier]: 'מעפילה',
}
