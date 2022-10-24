import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
    direction: 'rtl',
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 1000,
            lg: 1300,
            xl: 1600,
        }
    },
})
