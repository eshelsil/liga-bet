import React from 'react';
import RemoveIcon from '@mui/icons-material/RemoveCircle';
import { IconButton, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/AddCircle';


interface Props {
	value: string,
	label: string,
	addPrize: () => void,
	updatePrize: (value: string) => void,
	removePrize: () => void,
}

function PrizeInput({
	value,
	label,
	addPrize,
	updatePrize,
	removePrize,
}: Props){
	return (
		<div className='LigaBet-PrizeInput'>
			<div className='removeIcon'>
				<IconButton
					onClick={removePrize}
					disabled={!removePrize}
				>
					<RemoveIcon
						color={'error'}
					/>
				</IconButton>
			</div>
			<TextField
				label={label}
				onChange={(e) => updatePrize(e.target.value)}
				value={value}
			/>
			<div className='addIcon'>
				{addPrize && (
					<IconButton
						onClick={addPrize}
					>
						<AddIcon
							color={'primary'}
						/>
					</IconButton>
				)}
			</div>
		</div>
	);
}


export default PrizeInput;