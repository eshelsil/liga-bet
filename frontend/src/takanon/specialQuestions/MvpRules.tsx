import React from 'react'

interface Props {
    score: number
}

function MvpRules({ score }: Props) {
    return (
        <>
            <h5 className="underlined">מצטיין הטורניר</h5>
            <h5>{score} נקודות</h5>
        </>
    )
}

export default MvpRules
