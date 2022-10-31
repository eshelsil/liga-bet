import React from 'react'
import { Link } from '@mui/material';
import CopyToClipboard from './CopyToClipBoard';


interface Props {
    label: string
    link: string
    title?: string
}

function CopyLink({label, link, title}: Props) {

    return (
        <CopyToClipboard title={title} renderChildren={
            ({copy}) => (
                <Link
                    className='copyLink'
                    onClick={ () => copy(link) }
                >
                    {label}
                </Link>
            )
        } />
    )
}

export default CopyLink
