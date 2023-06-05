import { CompetitionStageName, KnockoutStage } from '../types'

export const stageNameToHeb = {
    [KnockoutStage.Final]: 'גמר',
    [KnockoutStage.ThirdPlace]: 'מקום 3-4',
    [KnockoutStage.SemiFinal]: 'חצי גמר',
    [KnockoutStage.QuarterFinal]: 'רבע גמר',
    [KnockoutStage.Last16]: 'שמינית גמר',
}

export function getHebStageName(stage: KnockoutStage){
    return stageNameToHeb[stage] ?? stage
}

export const competitionStageToString = {
	[CompetitionStageName.Winning]: 'זכייה בתואר',
	[CompetitionStageName.Final]: 'הגעה לגמר',
	[CompetitionStageName.SemiFinal]: 'הגעה לחצי גמר',
	[CompetitionStageName.QuarterFinal]: 'הגעה לרבע גמר',
}

export function getHebCompetitionStageName(stage: CompetitionStageName){
    return competitionStageToString[stage] ?? stage
}