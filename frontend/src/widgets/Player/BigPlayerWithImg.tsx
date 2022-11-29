import React from 'react'
import PlayerWithImg from './PlayerWithImg';
import { PlayerWithImgProps } from './types'


function BigPlayerWithImg(props: PlayerWithImgProps) {
    const {classes = {}, ...restProps} = props;
    return (
        <PlayerWithImg 
            size={60}
            classes={{
                ...classes,
                name: `nameBig ${classes.name ?? ''}`,
            }}
            {...restProps}
        />
    )
}

export default BigPlayerWithImg
