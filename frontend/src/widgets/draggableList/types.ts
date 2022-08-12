import React, { ReactNode } from "react";

export interface ItemBase {
	id: string | number,
}

export interface Item {
	id: string | number,
	data: ItemBase,
}

export interface DraggableListProps<T extends ItemBase> {
	items: T[],
	setItems: (items: ItemBase[]) => void,
	Component: React.FunctionComponent<T>,
}

export interface DraggableItemProps<T> {
  item: T,
  index: number,
	Component: React.FunctionComponent<T>,
}