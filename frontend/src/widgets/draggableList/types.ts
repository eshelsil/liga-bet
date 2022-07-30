export interface ItemBase {
    id: string | number,
}

export interface Item {
    id: string | number,
    data: ItemBase,
}

export interface DraggableListProps {
    items: ItemBase[],
    setItems: (items: ItemBase[]) => void,
    Component: React.FC,
}

export interface DraggableItemProps {
  item: any,
  index: number,
  Component: React.FC,
}