import { MenuProps } from '@mui/material/Menu'
import { ReactNode } from 'react'

export interface PopupMenuProps {
    anchorContent: ReactNode
    children: ReactNode
    classes?: MenuProps['classes']
}