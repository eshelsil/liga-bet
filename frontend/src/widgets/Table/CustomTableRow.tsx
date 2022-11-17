import React, { useEffect, useState } from 'react';
import { Collapse, TableCell, TableRow } from '@mui/material';
import { CustomTableRowProps, Model } from './types';


export default function CustomTableRow<T extends Model>({
    model,
    cells,
	getRowClassName,
	onClick: action,
	getExpandContent,
}: CustomTableRowProps<T>) {
	const [collapseIn, setCollapseIn] = useState(false)
	const className = getRowClassName ? getRowClassName(model) : ''
	const onClick = () => {
		action && action(model)
	}
	const expandConetnt = getExpandContent ? getExpandContent(model) : false

	useEffect(() => {
		setCollapseIn(!!expandConetnt)
	}, [expandConetnt])
	return (
		<>
			<TableRow className={`LigaBet-CustomTableRow ${className || ''}`} onClick={onClick}>
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
			{expandConetnt && (
				<TableRow className={`CustomTable-ExpandedSection`}>
					<TableCell colSpan={cells.length} className='ExpandedSection-cell'>
						<Collapse in={collapseIn}>
							{expandConetnt}
						</Collapse>
					</TableCell>
				</TableRow>
			)}
		</>
	);
}
