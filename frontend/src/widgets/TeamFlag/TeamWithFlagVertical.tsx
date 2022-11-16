import React from 'react'
import TeamWithFlag from './TeamWithFlag'
import { TeamWithFlagProps } from './types'


function TeamWithFlagVertical(props: TeamWithFlagProps) {
    const {classes = {}, ...restProps} = props;
    return (
        <TeamWithFlag 
            size={56}
            classes={{
                ...classes,
                root: `LB-TeamWithFlagVertical ${classes.root ?? ''}`
            }}
            {...restProps}
        />
    )
}

export default TeamWithFlagVertical
