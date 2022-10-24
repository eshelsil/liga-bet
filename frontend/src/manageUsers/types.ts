export type UserAction = (userId: number) => void

export type UserUpdateEditPermissions = (userId: number, value: boolean) => Promise<void>
