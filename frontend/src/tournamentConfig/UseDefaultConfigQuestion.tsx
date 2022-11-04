import React, { useState } from 'react';
import { Button, FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { NoSelector } from '../_selectors';
import useGoTo from '../hooks/useGoTo';
import { answerDefaultConfigQuestion } from '../_actions/tournament';
import { connect } from 'react-redux';


function UseDefaultConfigQuestion({
	answerDefaultConfigQuestion,
	onUseDefaultScore,
}){
	const { goToScoresConfig } = useGoTo()
	const [keepDefaultConfig, setKeepDefaultConfig] = useState(true)
	
	const saveAnswer = () => {
		if (keepDefaultConfig){
			onUseDefaultScore()
		} else {
			goToScoresConfig()
		}
		answerDefaultConfigQuestion()
			.catch(()=>{})
	}

	return (
		<div className='LB-UseDefaultConfigQuestion'>
			<h2>קביעת שיטת הניקוד</h2>	
			<div className='DefaultConfigQuestion-text'>
				שיטת הניקוד לאורך כל הטורניר מחושבת בצורה אופטימלית ואנו ממליצים להשאיר את הגדרות ברירת המחדל.
			</div>
			<div className='UseDefaultConfigQuestion-buttons'>
				<FormControl variant='outlined'>
					<RadioGroup
						className='radioSelection'
						row
                        value={keepDefaultConfig ? 'default' : 'custom'}
                        onChange={(e) => setKeepDefaultConfig(e.target.value === 'default')}
                        name="useDefaultConfig"
                    >
						<FormControlLabel
							value={'default'}
							control={<Radio />}
							label={'הולך איתכם'}
							style={{marginLeft: 24}}
						/>
						<FormControlLabel
							value={'custom'}
							control={<Radio />}
							label={'אני רוצה לשנות בכל זאת'}
						/>
                    </RadioGroup>
				</FormControl>
				<div className='continueBtnBontainer'>
					<Button variant="contained" color="primary" onClick={saveAnswer}>
						המשך
					</Button>
				</div>
			</div>
		</div>
	);
}

const mapDispatchToState = {
	answerDefaultConfigQuestion,
}


export default connect(NoSelector, mapDispatchToState)(UseDefaultConfigQuestion);