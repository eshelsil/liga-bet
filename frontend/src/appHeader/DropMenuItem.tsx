import React, {ReactNode} from 'react';
import MenuItem from "@mui/material/MenuItem";
import {Menu} from "@mui/material";

interface Props {
    label: string | ReactNode
    children: ReactNode
    className?: string
}

const DropMenuItem = ({label, children, className}: Props) => {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


    return <MenuItem
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        className={'appbar-item ' + className || ''}
    >
        <div
            onClick={handleClick}
        >
            {label}
        </div>
        <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={!!anchorEl}
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
                className: 'menu',
                onClick: handleClose
            }}
        >
            {children}
        </Menu>
    </MenuItem>;
}

export default DropMenuItem;