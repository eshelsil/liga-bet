import { ReactNode } from 'react';

export interface Model {
    id: string | number;
}

export interface CellDescription<Model> {
    id: string,
    getter: (model: Model) => ReactNode,
    label: string,
}

export interface CustomTableProps<Model> {
    models: Model[],
    cells: CellDescription<Model>[],
}

export interface CustomTableRowProps<Model> {
    model: Model,
    cells: CellDescription<Model>[],
}