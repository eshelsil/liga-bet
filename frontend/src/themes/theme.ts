import { createTheme } from '@mui/material/styles'
import { Direction } from '../i18n/direction'

export const createAppTheme = (direction: Direction = 'rtl') =>
    createTheme({
        direction,
        breakpoints: {
            values: {
                xs: 0,
                sm: 600,
                md: 1000,
                lg: 1300,
                xl: 1600,
            },
        },
        typography: {
            button: {
                textTransform: 'none',
            },
        },
        components: {
            MuiTab: {
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                    },
                },
            },
        },
    })

// Back-compat default (RTL) for any importer not yet direction-aware.
export const theme = createAppTheme('rtl')
