import React from 'react'
import { useTranslation } from 'react-i18next'
import { prizeToString } from '../utils'

interface Props {
    prizes: string[]
}

function PrizesRules({ prizes }: Props) {
    const { t } = useTranslation('takanon')
    if (prizes.length === 0){
        return null
    }
    return (
        <div className='LB-FloatingFrame'>
            <h3 style={{ marginBottom: 20, marginTop: 8 }}>{t('prizes.heading')}</h3>
            <ul style={{ marginTop: 8 }}>
                {prizes.map((prize, index) => (
                    <li key={index}>
                        <u>{prizeToString[index + 1]}:</u>
                        {' ' + prize}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default PrizesRules
