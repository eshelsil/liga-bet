import i18n from '@/i18n/config'

export const matchRuleToString = new Proxy(
    {} as Record<string, string>,
    {
        get: (_t, prop) =>
            i18n.t(`utils:matchRules.${String(prop)}`, {
                defaultValue: String(prop),
            }),
    }
)
