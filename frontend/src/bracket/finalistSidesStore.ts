// Per-tournament memory of which finalist the user placed on the left vs the right.
// The saved Winner/Runner-Up bet only stores the two team ids (not their sides), so for
// teams whose bracket side isn't yet known we'd otherwise guess the order and it could
// flip on refresh. Persisting the chosen sides keeps the layout stable across reloads.

export interface FinalistSides {
    left: number | null
    right: number | null
}

const EMPTY: FinalistSides = { left: null, right: null }

const storageKey = (tournamentId: number | string) => `lb:bracketFinalistSides:${tournamentId}`

export function readFinalistSides(tournamentId: number | string): FinalistSides {
    try {
        const raw = localStorage.getItem(storageKey(tournamentId))
        if (!raw) return EMPTY
        const parsed = JSON.parse(raw)
        return {
            left: typeof parsed?.left === 'number' ? parsed.left : null,
            right: typeof parsed?.right === 'number' ? parsed.right : null,
        }
    } catch {
        return EMPTY
    }
}

export function writeFinalistSides(tournamentId: number | string, sides: FinalistSides): void {
    try {
        localStorage.setItem(storageKey(tournamentId), JSON.stringify(sides))
    } catch {
        // storage unavailable / quota — non-fatal, the order just won't persist
    }
}
