import React from 'react'
import { useSelector } from 'react-redux'
import LinkMenuItem from '../LinkMenuItem'
import { routesMap } from '../routes'
import { MissingGameBetsCount } from '../../_selectors'


interface Props {
    callback?: () => void
}

function OpenGameBetsItem({
    callback,
}: Props) {
    const notifications = useSelector(MissingGameBetsCount)

    return (
        <LinkMenuItem
            route={routesMap['open-matches']}
            callback={callback}
            notifications={notifications}
        />
    )
}

export default OpenGameBetsItem
