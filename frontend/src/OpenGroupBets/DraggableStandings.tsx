import React from 'react'
import { Team } from '../types'
import DraggableList from '../widgets/draggableList/DraggableList'
import TeamStanding from './TeamStanding'

function RanksView({ count }: { count: number }) {
    return (
        <div>
            {[...Array(count).keys()].map((index) => (
                <div
                    className='rankDisplay'
                    key={index}
                >
                    <div className='rank'>
                        {index + 1}
                    </div>
                </div>
            ))}
        </div>
    )
}

interface Props {
    items: Team[]
    setItems: (teams: Team[]) => void
    isDisabled?: boolean
}

function DraggableStandings({ items, setItems, isDisabled }: Props) {
    return (
        <div className="DraggableStandings">
            <RanksView count={items.length} />
            <div style={{ flex: '1 auto' }}>
                <DraggableList
                    items={items}
                    setItems={setItems}
                    Component={TeamStanding}
                    isDisabled={isDisabled}
                />
            </div>
        </div>
    )
}

export default DraggableStandings
