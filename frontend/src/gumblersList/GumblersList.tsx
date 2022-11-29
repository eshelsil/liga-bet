import React from 'react'
import { useSelector } from 'react-redux'
import { CurrentUtlName } from '../_selectors'
import './GumblersList.scss'


interface Props {
    gumblers: string[]
}

function GumblersList({ gumblers }: Props) {
    const utlName = useSelector(CurrentUtlName)

    return (
        <div className='LB-GumblersList'>
            {gumblers.map(name => (
                <div key={name} className={`GumblersList-gumbler ${name === utlName ? 'GumblersList-currentUtl' : ''}`}>
                    {name}
                </div>
            ))}
        </div>
    )
}

export default GumblersList