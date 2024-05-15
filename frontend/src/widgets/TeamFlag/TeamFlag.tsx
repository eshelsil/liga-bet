import React from 'react'
import { CircleFlag } from 'react-circle-flags'
import { Team } from '../../types'


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
    'denmark': 'dk',
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
    'slovenia': 'si',

    'nigeria': 'ng',
    'iceland': 'is',
    'sweden': 'se',
    'turkey': 'tr',
    'austria': 'at',
    'ukraine': 'ua',
    'north macedonia': 'mk',
    scotland: 'gb-sct',
    slovakia: 'sk',
}

interface Props {
    team: Team
    size?: number
}

function TeamFlag({
    team,
    size = 50,
}: Props) {
    const {name, is_club} = team
    const tla = teamNameToCountryCode[name.toLowerCase()] ?? name.slice(0,2).toLowerCase()
    return (
        <div className={`LB-TeamFlag ${is_club ? '' : 'TeamFlag-shadow'}`}>
            {is_club && (
                <img className="TeamFlag-clubImage" src={team.crest_url} height={size} width={size} />
            )}
            {!is_club && (
                <CircleFlag countryCode={tla} height={size} width={size} />
            )}
        </div>
    )
}

export default TeamFlag
