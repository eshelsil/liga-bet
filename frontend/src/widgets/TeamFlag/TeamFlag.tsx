import React from 'react'
import { CircleFlag } from 'react-circle-flags'


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
    name: string
    size?: number
}

function TeamFlag({
    name,
    size = 50,
}: Props) {
    const tla = teamNameToCountryCode[name.toLowerCase()] ?? name.slice(0,2).toLowerCase()
    return (
        <div className='LB-TeamFlag'>
            <CircleFlag countryCode={tla} height={size} width={size} />
        </div>
    )
}

export default TeamFlag
