import * as React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import ListItem from '@mui/material/ListItem';
import { DraggableItemProps, ItemBase } from './types';


const DraggableListItem = ({
    item,
    index,
    Component,
}: DraggableItemProps<any>) => {
  return (
    <Draggable draggableId={`${item.id}`} index={index}>
      {(provided, snapshot) => (
        
        <ListItem
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`${snapshot.isDragging ? 'draggingItem' : ''}`}
          sx={{
            padding: 0,
            marginTop: 0.75,
            marginBottom: 0.75,
          }}
        >
          <Component {...item.data} isDragging={snapshot.isDragging} index={index} />
        </ListItem>
      )}
    </Draggable>
  );
};

export default DraggableListItem;