import { CompetitionStageName, GameStage, GameType, KnockoutStage, Match } from '../types'
import { getHebGroupName } from './groups'

export const stageNameToHeb = {
    [KnockoutStage.Final]: 'גמר',
    [KnockoutStage.ThirdPlace]: 'מקום 3-4',
    [KnockoutStage.SemiFinal]: 'חצי גמר',
    [KnockoutStage.QuarterFinal]: 'רבע גמר',
    [KnockoutStage.Last16]: 'שמינית גמר',
    [GameType.GroupStage]: 'שלב הבתים',
}

export function getHebStageName(stage: GameStage){
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


export function getHebGameStage(game: Match){
    if (game.is_knockout){
        return getHebStageName(game.subType as KnockoutStage)
    }
    const groupName = game.group?.name
    return groupName ? getHebGroupName(groupName) : ''
}