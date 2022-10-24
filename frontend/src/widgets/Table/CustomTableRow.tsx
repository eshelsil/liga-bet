import React from 'react';
import { TableCell, TableRow } from '@mui/material';
import { CustomTableRowProps, Model } from './types';


export default function CustomTableRow<T extends Model>({
    model,
    cells,
}: CustomTableRowProps<T>) {
	return (
		<TableRow className='LigaBet-CustomTableRow'>
			{model.isFullRow && (
				<TableCell colSpan={cells.length}>{model.fullRowContent}</TableCell>
			)}
			{!model.isFullRow && (<>
				{cells.map(cell => (
					<TableCell key={cell.id}>
						{cell.getter(model)}
					</TableCell>
				))}
			</>)}
		</TableRow>
	);
}
