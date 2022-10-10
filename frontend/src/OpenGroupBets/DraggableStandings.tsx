import React from 'react'
import { Team } from '../types'
import DraggableList from '../widgets/draggableList/DraggableList'
import TeamStanding from './TeamStanding'

function RanksView({ count }: { count: number }) {
    return (
        <div className="">
            {[...Array(count).keys()].map((index) => (
                <div
                    key={index}
                    style={{
                        height: 36,
                        width: 40,
                        marginTop: 6,
                        marginBottom: 6,
                    }}
                >
                    <span style={{ fontSize: 24, lineHeight: 1.5 }}>
                        {index + 1}.
                    </span>
                </div>
            ))}
        </div>
    )
}

interface Props {
    items: Team[]
    setItems: (teams: Team[]) => void
}

function DraggableStandings({ items, setItems }: Props) {
    return (
        <div className="DraggableStandings">
            <RanksView count={items.length} />
            <div style={{ flex: '1 auto' }}>
                <DraggableList
                    items={items}
                    setItems={setItems}
                    Component={TeamStanding}
                />
            </div>
        </div>
    )
}

export default DraggableStandings
