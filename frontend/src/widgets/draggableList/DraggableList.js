import * as React from 'react';
import DraggableListItem from './DraggableListItem';
import {
  DragDropContext,
  Droppable,
} from 'react-beautiful-dnd';

let id = 0;
function gen_id(){
    id++;
    return `draggable-list-gen-id_${id}`;
}

function listFromItems(items){
    return items.map(item => ({
        id: item.id,
        data: item,
    }))
}

const DraggableList = React.memo(({
    items,
    setItems,
    Component,
    classes: {
        itemRoot,
        itemRootDragging,
    } = {},
}) => {
    const id = gen_id();
    const listItems = listFromItems(items);
    const onDragEnd = ({ destination, source }) => {
        // dropped outside the list
        if (!destination) return;
        
        const startIndex = source.index;
        const endIndex = destination.index;
        const orderedItems = Array.from(items);
        const [removedItem] = orderedItems.splice(startIndex, 1);
        orderedItems.splice(endIndex, 0, removedItem);
        setItems(orderedItems);
    };
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId={id}>
                {provided => (
                    <div className='SortableList' ref={provided.innerRef} {...provided.droppableProps}>
                        {listItems.map((item, index) => (
                            <DraggableListItem
                                key={item.id}
                                index={index}
                                item={item}
                                Component={Component}
                                className={itemRoot}
                                draggingClassName={itemRootDragging}
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
});

export default DraggableList;
