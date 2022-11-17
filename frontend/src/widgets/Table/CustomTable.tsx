import React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { CustomTableProps, Model } from './types';
import CustomTableRow from './CustomTableRow';


export default function CustomTable<T>({
	models,
	cells,
	getRowClassName,
	onModelRowClick,
	getExpandContent,
}: CustomTableProps<Model>) {
	return (
		<TableContainer className='LigaBet-CustomTable' component={Paper}>
			<Table>
				<TableHead>
					<TableRow>
						{cells.map(cell => (
							<TableCell key={cell.id} className={`tableHeaderCell ${cell.classes?.header ?? ''}`}>{cell.header}</TableCell>
						))}
					</TableRow>
				</TableHead>
				<TableBody>
					{models.map((model) => (
						<CustomTableRow
							key={model.id}
							model={model}
							cells={cells}
							getRowClassName={getRowClassName}
							onClick={onModelRowClick}
							getExpandContent={getExpandContent}
						/>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
