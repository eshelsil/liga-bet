import React from 'react'
import { getHebTeamName } from '../../strings/teamNames'
import TeamFlag from './TeamFlag'
import { TeamWithFlagProps } from './types'
import './TeamWithFlag.scss'



function TeamWithFlag({
    name,
    classes,
    is_ko_winner,
    size = 32,
}: TeamWithFlagProps) {
    return (
        <div className={`TeamWithFlag ${classes?.root ?? ''}`}>
            <TeamFlag name={name} size={size} />
            {name && (
                <div
                    className={`TeamWithFlag-name ${classes?.name ?? ''}`}
                >
                    {getHebTeamName(name)}
                </div>
            )}
            {is_ko_winner && (
                <div
                    style={{
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center',
                        alignContent: 'flex-start',
                        marginRight: 8,
                        marginLeft: -28,
                    }}
                >
                    <span
                        style={{
                            background: '#286090',
                            height: 20,
                            width: 20,
                            lineHeight: 1,
                            borderRadius: '50%',
                            display: 'block',
                        }}
                    ></span>
                    <label
                        className="toggle"
                        style={{
                            color: '#ffff00',
                            position: 'absolute',
                        }}
                    >
                        <i className="fa fa-star"></i>
                    </label>
                </div>
            )}
        </div>
    )
}

export default TeamWithFlag
