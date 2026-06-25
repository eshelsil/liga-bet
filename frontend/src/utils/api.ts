import i18n from '@/i18n/config'

export function reportApiError(error: any) {
    window['toastr']['error'](
        error?.responseJSON?.message ??
            i18n.t('utils:errors.unknownApiError')
    )
}
