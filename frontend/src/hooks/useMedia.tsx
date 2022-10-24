import { Breakpoint, useMediaQuery, useTheme } from '@mui/material'

export function useHandleMediaQuery(breakpoint: Breakpoint){
    const theme = useTheme()
    return useMediaQuery(theme.breakpoints.down(breakpoint), { noSsr: true })
}

export function useIsSmScreen() {
    return useHandleMediaQuery('md');
}

export function useIsXsScreen() {
    return useHandleMediaQuery('sm');
}