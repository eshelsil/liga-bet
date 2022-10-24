import { CompetitionStageName } from '../../types';

export const competitionStageToString = {
	[CompetitionStageName.Winning]: 'זכייה בתואר',
	[CompetitionStageName.Final]: 'הגעה לגמר',
	[CompetitionStageName.SemiFinal]: 'הגעה לחצי גמר',
	[CompetitionStageName.QuarterFinal]: 'הגעה לרבע גמר',
}
