import React, { useState } from 'react';
import { Button, Grid } from '@mui/material';
import { prizeToString } from '../../utils';
import { TournamentConfig } from '../../types';
import PrizeInput from './PrizeInput';
import PrizesRules from '../../takanon/PrizesRules';
import TakanonPreviewSection from '../takanonPreview/TakanonPreviewSection';


function ignoreLastStringIfEmpty(strings: string[]){
	const newStrings = [...strings];
	if (strings.at(-1).length === 0){
		newStrings.pop();
	}
	return newStrings;
}

const MAX_PRIZES = 10;

interface Props {
	prizes: string[],
	updatePrizes: (config: TournamentConfig['prizes']) => Promise<void>,
}

function PrizesConfig({
	prizes: currentPrizes,
	updatePrizes,
}: Props){
	const initialState = currentPrizes?.length > 0 ? currentPrizes : [''];
	const [prizes, setPrizes] = useState(initialState);

	const resetToDefault = () => setPrizes(initialState);
	const addPrize = () => {
		setPrizes([
			...prizes,
			'',
		]);
	};
	const removePrize = (index: number) => {
		const newPrizes = [...prizes];
		newPrizes.splice(index, 1);
		setPrizes(newPrizes);
	};

	const updatePrize = (index: number, value: string) => {
		const newPrizes = [...prizes];
		newPrizes[index] = value;
		setPrizes(newPrizes);
	};
	const shouldShowAddButton = (index: number) => (
		index === prizes.length -1 && prizes.length < MAX_PRIZES
	);
	const canDeletePrizes = prizes.length > 1;

	const compactedPrizes = ignoreLastStringIfEmpty(prizes);
	const hasPrizes = compactedPrizes.length > 0;

	const submit = () => {
		updatePrizes(prizes)
			.then(() => {
				window['toastr']['success']('הפרסים עודכנו בהצלחה')
			})
	}

	return (
		<div className='LigaBet-PrizesConfig'>
			<Grid container>
				<Grid item md={6}>
					<div className={'prizesContainer'}>
						{prizes.map((prize, index) => (
							<PrizeInput
								key={index}
								label={prizeToString[index + 1]}
								value={prize}
								addPrize={shouldShowAddButton(index) ? addPrize : null}
								updatePrize={(value: string) => updatePrize(index, value)}
								removePrize={canDeletePrizes ? () => removePrize(index) : null}
							/>
						))}
					</div>
				</Grid>
				<Grid item md={6}>
					<TakanonPreviewSection>
						{hasPrizes && (<>
							<PrizesRules prizes={compactedPrizes}/>
						</>)}
					</TakanonPreviewSection>
				</Grid>
			</Grid>
			<div className={'savePrizes'}>
				<Button className={''} variant='contained' color='primary' onClick={submit}>עדכן</Button>
			</div>
		</div>
	);
}


export default PrizesConfig;