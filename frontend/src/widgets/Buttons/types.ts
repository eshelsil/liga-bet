import { ButtonProps } from '@mui/material/Button'

export interface ButtonWithLoaderProps extends ButtonProps {
    loading?: boolean
}

export interface LoadingButtonProps extends ButtonProps {
    action: () => Promise<void>
}