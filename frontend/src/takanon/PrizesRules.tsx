import React from 'react'
import { prizeToString } from '../utils'

interface Props {
    prizes: string[]
}

function PrizesRules({ prizes }: Props) {
    return (
        <>
            <h3 style={{ marginBottom: 20 }}>פרסים</h3>
            <ul style={{ marginTop: 8 }}>
                {prizes.map((prize, index) => (
                    <li key={index}>
                        <u>{prizeToString[index + 1]}:</u>
                        {' ' + prize}
                    </li>
                ))}
            </ul>
        </>
    )
}

export default PrizesRules
