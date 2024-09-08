import React from 'react'
import { Team } from '../types'
import DraggableList from '../widgets/draggableList/DraggableList'
import TeamStanding, {TeamStandingProps} from './TeamStanding'
import { cn } from '@/utils'

function RanksView({ count, classes = {}, }: { count: number, classes?: Record<number, string> }) {
    return (
        <div>
            {[...Array(count).keys()].map((index) => (
                <div
                    className={cn('rankDisplay')}
                    key={index}
                >
                    <div className={cn('rank', classes[index])}>
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
    classes?: Record<number, string>
}

function DraggableStandings({ items, setItems, isDisabled, classes }: Props) {
    return (
        <div className="DraggableStandings">
            <RanksView count={items.length} classes={classes} />
            <div style={{ flex: '1 auto' }}>
                <DraggableList
                    items={items}
                    setItems={setItems}
                    Component={({...props}: Omit<TeamStandingProps, 'classes'>) => <TeamStanding classes={classes} {...props}/>}
                    isDisabled={isDisabled}
                />
            </div>
        </div>
    )
}

export default DraggableStandings
