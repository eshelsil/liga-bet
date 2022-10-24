import { ReactNode } from 'react';

export interface Model {
    id: string | number;
    isFullRow?: boolean;
    fullRowContent?: ReactNode;
}

export interface CellDescription<Model> {
    id: string,
    getter: (model: Model) => ReactNode,
    header: ReactNode,
}

export interface CustomTableProps<Model> {
    models: Model[],
    cells: CellDescription<Model>[],
}

export interface CustomTableRowProps<Model> {
    model: Model,
    cells: CellDescription<Model>[],
}