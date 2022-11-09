import React from 'react'
import LinkMenuItem from '../LinkMenuItem'
import { routesMap } from '../routes'


interface Props {
    callback?: () => void
}

function MyBetsItem({
    callback,
}: Props) {
    return (
        <LinkMenuItem
            route={routesMap['my-bets']}
            callback={callback}
        />
    )
}

export default MyBetsItem
