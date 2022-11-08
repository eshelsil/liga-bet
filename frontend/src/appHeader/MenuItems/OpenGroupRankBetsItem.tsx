import React from 'react'
import { useSelector } from 'react-redux'
import LinkMenuItem from '../LinkMenuItem'
import { routesMap } from '../routes'
import { MissingGroupRankBetsCount } from '../../_selectors'


interface Props {
    callback?: () => void
}

function OpenGroupRankBetsItem({
    callback,
}: Props) {
    const notifications = useSelector(MissingGroupRankBetsCount)

    return (
        <LinkMenuItem
            route={routesMap['open-group-standings']}
            callback={callback}
            notifications={notifications}
        />
    )
}

export default OpenGroupRankBetsItem
