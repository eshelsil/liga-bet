import React from 'react'
import { useSelector } from 'react-redux'
import LinkMenuItem from '../LinkMenuItem'
import { routesMap } from '../routes'
import { MissingQuestionBetsCount } from '../../_selectors'


interface Props {
    callback?: () => void
}

function OpenQuestionBetsItem({
    callback,
}: Props) {
    const notifications = useSelector(MissingQuestionBetsCount)

    return (
        <LinkMenuItem
            route={routesMap['open-questions']}
            callback={callback}
            notifications={notifications}
        />
    )
}

export default OpenQuestionBetsItem
