export interface SpecialQuestion {
    id: number,
    name: string,
    answer: number,
}

export type SpecialQuestionsById = Record<number, SpecialQuestion>