import i18n from '@/i18n/config'

export const prizeToString = new Proxy(
    {} as Record<string | number, string>,
    {
        get: (_t, prop) =>
            i18n.t(`utils:prizes.${String(prop)}`, {
                defaultValue: String(prop),
            }),
    }
)
