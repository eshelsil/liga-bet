import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Grid, Link } from '@mui/material';
import { prizeToString } from '../../utils';
import { TournamentConfig } from '../../types';
import PrizeInput from './PrizeInput';
import PrizesRules from '../../takanon/PrizesRules';
import TakanonPreviewSection from '../takanonPreview/TakanonPreviewSection';
import { compact } from 'lodash';
import { LoadingButton } from '../../widgets/Buttons';
import { IsTournamentStarted } from '../../_selectors';
import './PrizesConfig.scss';


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
	onGoToScoresClick: () => void,
}

function PrizesConfig({
	prizes: currentPrizes,
	updatePrizes,
	onGoToScoresClick,
}: Props){
	const initialState = currentPrizes?.length > 0 ? currentPrizes : [''];
	const [prizes, setPrizes] = useState(initialState);
	const isTournamentStarted = useSelector(IsTournamentStarted)

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

	const submit = async () => {
		return await updatePrizes(compact(prizes))
			.then(() => {
				window['toastr']['success']('הפרסים עודכנו בהצלחה')
			})
			.catch(function (error) {
                console.log('FAILED updating prizes config', error)
            })
	}

	return (
		<div className='LigaBet-PrizesConfig'>
			<h2 className='LB-TitleText'>
				ניהול טורניר
			</h2>
			<div className='inputWithTakanon'>
				<Grid container>
					<Grid item xs={12} sm={6}>
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
					<Grid item xs={12} sm={6}>
						<TakanonPreviewSection>
							{hasPrizes && (<>
								<PrizesRules prizes={compactedPrizes}/>
							</>)}
						</TakanonPreviewSection>
					</Grid>
				</Grid>
				<div className={'savePrizes'}>
					<LoadingButton action={submit}>עדכן</LoadingButton>
				</div>
			</div>
			
			{!isTournamentStarted && (
				<div className='forgotSomething LB-FloatingFrame'>
					<h5>שכחת משהו?</h5>
					<Link
						className={'linkToScoresConfig'}
						onClick={onGoToScoresClick}
					>
						ערוך הגדרות ניקוד
					</Link>

				</div>
			)}
		</div>
	);
}


export default PrizesConfig;