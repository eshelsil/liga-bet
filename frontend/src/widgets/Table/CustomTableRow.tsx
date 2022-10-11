import React from 'react';
import { TableCell, TableRow } from '@mui/material';
import { CustomTableRowProps } from './types';


export default function CustomTableRow<T>({
    model,
    cells,
}: CustomTableRowProps<T>) {
	return (
		<TableRow className='LigaBet-CustomTableRow'>
			{cells.map(cell => (
				<TableCell key={cell.id}>
					{cell.getter(model)}
				</TableCell>
			))}
		</TableRow>
	);
}
