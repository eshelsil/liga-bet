import { isNil, omitBy } from 'lodash'
import { RecordKey } from '../types'

export function compactObject(object: object) {
    return omitBy(object, isNil)
}

export function createCounter() {
    let id = 1
    return () => {
        id++
        return id
    }
}

export function getAllEnumKeys<T>(enumObj: T) {
    return Object.keys(enumObj).filter((key) => {
        return isNaN(Number(key));
    }).map(key => key as keyof T);
}

export function getAllEnumValues<T>(enumObj: T): T[keyof T][] {
    return getAllEnumKeys(enumObj).map(key => enumObj[key]);
}

export function keysOf<T extends RecordKey>(obj: Record<T, any> | Partial<Record<T, any>>): T[] {
    let keys: T[] = []
    for (const key of Object.keys(obj)){
        keys.push(key as T)
    }
    return keys
}
