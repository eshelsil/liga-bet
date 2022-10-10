import React from 'react'
import { MyUtlsById } from '../types'
import UtlOption from './UtlOption'

interface Props {
    myUtls: MyUtlsById
    selectUtl: (...args: any) => any
}

function ChooseFromExistingUtls({ myUtls, selectUtl }: Props) {
    return (
        <div className="ChooseYourUtl">
            {Object.values(myUtls).map((utl) => (
                <UtlOption
                    onClick={() => selectUtl(utl.id)}
                    utl={utl}
                    key={utl.id}
                />
            ))}
        </div>
    )
}

export default ChooseFromExistingUtls
