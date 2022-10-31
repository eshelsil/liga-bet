import * as React from 'react'
import DraggableListItem from './DraggableListItem'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import { DraggableListProps, Item, ItemBase } from './types'
import './DraggableList.scss'

let id = 0
function gen_id() {
    id++
    return `draggable-list-gen-id_${id}`
}

function listFromItems(items: ItemBase[]): Item[] {
    return items.map((item) => ({
        id: item.id,
        data: item,
    }))
}

const DraggableList = React.memo(
    ({ items, setItems, Component, isDisabled }: DraggableListProps<ItemBase>) => {
        const id = gen_id()
        const listItems = listFromItems(items)
        const onDragEnd = ({ destination, source }: DropResult) => {
            if (!destination) return // dropped outside the list
            const startIndex = source.index
            const endIndex = destination.index
            const orderedItems = Array.from(items)
            const [removedItem] = orderedItems.splice(startIndex, 1)
            orderedItems.splice(endIndex, 0, removedItem)
            setItems(orderedItems)
        }
        return (
            <div className="SortableList">
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId={id}>
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                {listItems.map((item, index) => (
                                    <DraggableListItem
                                        key={item.id}
                                        index={index}
                                        item={item}
                                        Component={Component}
                                        isDisabled={isDisabled}
                                    />
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        )
    }
)

export default DraggableList
