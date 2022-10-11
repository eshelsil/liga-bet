import { MatchBetsScoreConfig } from '../types';

export function ensureNumberValuesOnMatchBetConfig(config: MatchBetsScoreConfig){
	const newConfig = {...config};
	for (const stageConfig of Object.values(newConfig)){
		for (const key in stageConfig){
			const numericValue = Number(stageConfig[key]);
			if (isNaN(numericValue)) {
				stageConfig[key] = 0;
			} else {
				stageConfig[key] = numericValue;
			}
		}
	}
	return newConfig;
}
