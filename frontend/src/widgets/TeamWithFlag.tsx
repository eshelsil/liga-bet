import React from 'react'
import { CircleFlag } from 'react-circle-flags'
import './TeamWithFlag.scss'


const teamNameToCountryCode = {
    'portugal': 'pt',
    'uruguay': 'uy',
    'senegal': 'sn',
    'netherlands': 'nl',
    'england': 'gb-eng',
    'united states': 'us',
    'wales': 'gb-wls',
    'mexico': 'mx',
    'poland': 'pl',
    'germany': 'de',
    'denemark': 'dk',
    'tunisia': 'tn',
    'costa rica': 'cr',
    'japan': 'jp',
    'spain': 'es',
    'croatia': 'hr',
    'morocco': 'ma',
    'cameroon': 'cm',
    'serbia': 'rs',
    'switzerland': 'ch',
    'south korea': 'kr',
}

interface Props {
    name: string
    crest_url: string
    is_ko_winner?: boolean
    size?: number
    // is_underlined?: boolean
    // is_bold?: boolean
}

function TeamWithFlag({
    name,
    crest_url,
    is_ko_winner,
    size = 50,
    // is_underlined,
    // is_bold,
}: Props) {
    const tla = teamNameToCountryCode[name.toLowerCase()] ?? name.slice(0,2).toLowerCase()
    console.log(name, tla)
    return (
        <div className="TeamWithFlag">
            <CircleFlag countryCode={tla} height={size} />
            {name && (
                <span
                    // className={`team_with_flag-span
                    //     ${is_underlined ? 'underlined' : ''}
                    //     ${is_bold ? 'bolded' : ''}
                    // `}
                    className={'TeamWithFlag-name'}
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

export default TeamWithFlag
