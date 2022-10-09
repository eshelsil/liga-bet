import React from 'react'

interface Props {
    name: string
    crest_url: string
    is_ko_winner?: boolean
    is_underlined?: boolean
    is_bold?: boolean
}

function TeamAndSymbol({
    name,
    crest_url,
    is_ko_winner,
    is_underlined,
    is_bold,
}: Props) {
    return (
        <div className="team-and-flag">
            {crest_url && (
                <div className="flag-wrapper">
                    <img className="team_flag" src={crest_url} />
                </div>
            )}
            {name && (
                <span
                    className={`team_with_flag-span
                ${is_underlined ? 'underlined' : ''}
                ${is_bold ? 'bolded' : ''}
            `}
                >
                    {name}
                </span>
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

export default TeamAndSymbol
