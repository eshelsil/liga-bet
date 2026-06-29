import { createContext, useContext } from 'react'

// Interaction wiring for the tree, so slots don't need props drilled through every level.
// The tree is CONTEXT only: team slots are not selectable. Group-position tokens open
// standings; chosen finalists are highlighted.
export interface BracketTreeInteraction {
    isFinalist: (teamId: number) => boolean // team chosen as a finalist → highlight its path
    isEliminated?: (teamId: number) => boolean // spectator: this pick is out → eliminated styling
    onOpenGroup: (groupId: number, position?: number | null) => void // token → group standings (marking the target position)
    onOpenThirdPlace: () => void // open the "how 3rd place works" dialog
}

const noop = () => undefined

const BracketTreeContext = createContext<BracketTreeInteraction>({
    isFinalist: () => false,
    isEliminated: () => false,
    onOpenGroup: noop,
    onOpenThirdPlace: noop,
})

export const BracketTreeProvider = BracketTreeContext.Provider
export const useBracketTree = () => useContext(BracketTreeContext)
