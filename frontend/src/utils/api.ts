export function reportApiError(error: any) {
    window['toastr']['error'](error?.responseJSON?.message ?? 'שגיאה לא מזוהה')
}
