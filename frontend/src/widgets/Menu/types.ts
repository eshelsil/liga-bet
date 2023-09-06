import { MenuProps } from '@mui/material/Menu'
import { ReactNode } from 'react'
import { AnyFunc } from '../../types'

export interface PopupMenuProps {
    anchorContent: ReactNode
    children: ReactNode
    onClose?: AnyFunc
    classes?: MenuProps['classes']
}