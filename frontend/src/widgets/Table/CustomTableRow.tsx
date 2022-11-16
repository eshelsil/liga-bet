import React from 'react';
import { TableCell, TableRow } from '@mui/material';
import { CustomTableRowProps, Model } from './types';


export default function CustomTableRow<T extends Model>({
    model,
    cells,
	getRowClassName,
}: CustomTableRowProps<T>) {
	const className = getRowClassName ? getRowClassName(model) : ''
	return (
		<TableRow className={`LigaBet-CustomTableRow ${className || ''}`}>
			{model.isFullRow && (
				<TableCell colSpan={cells.length} className={model.fullRowCellClass ?? ''}>{model.fullRowContent}</TableCell>
			)}
			{!model.isFullRow && (<>
				{cells.map(cell => (
					<TableCell className={`${cell.classes?.cell ?? ''}`} key={cell.id}>
						{cell.getter(model)}
					</TableCell>
				))}
			</>)}
		</TableRow>
	);
}
