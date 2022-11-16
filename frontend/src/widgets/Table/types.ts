import { ReactNode } from 'react';

export interface Model {
    id: string | number;
    isFullRow?: boolean;
    fullRowContent?: ReactNode;
    fullRowCellClass?: string;
}

export interface CellDescription<Model> {
    id: string,
    getter: (model: Model) => ReactNode,
    header: ReactNode,
    classes?: {
        header?: string,
        cell?: string,
    }
}

export interface CustomTableProps<Model> {
    models: Model[],
    cells: CellDescription<Model>[],
    getRowClassName?: (model: Model) => string,
}

export interface CustomTableRowProps<Model> {
    model: Model,
    cells: CellDescription<Model>[],
    getRowClassName?: (model: Model) => string,
}