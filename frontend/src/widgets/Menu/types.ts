import { MenuProps } from '@mui/material'
import { ReactNode } from 'react'

export interface PopupMenuProps {
    anchorContent: ReactNode
    children: ReactNode
    classes?: MenuProps['classes']
}