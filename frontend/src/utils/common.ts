import { isNil, omitBy } from "lodash";

export function compactObject(object: object){
    return omitBy(object, isNil)
}

export function createCounter(){
    let id = 1;
    return () => {
        id++;
        return id;
    };
}