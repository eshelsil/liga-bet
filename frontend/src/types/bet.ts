export enum BetType {
    Match = 1,
    GroupsRank = 2,
    Question = 3,
}

export interface BetBase {
    id: number,
    tournament_id: number,
    type: BetType,
    type_id: number,
}