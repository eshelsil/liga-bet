import React from 'react'
import TeamWithFlag from './TeamWithFlag'
import { TeamWithFlagProps } from './types'


function BigTeamWithFlag(props: TeamWithFlagProps) {
    const {classes = {}, ...restProps} = props;
    return (
        <TeamWithFlag 
            size={50}
            classes={{
                ...classes,
                name: `teamNameBig ${classes.name ?? ''}`,
            }}
            {...restProps}
        />
    )
}

export default BigTeamWithFlag
