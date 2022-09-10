import { isNil, omitBy } from "lodash";

export function compactObject(object: object){
    return omitBy(object, isNil)
}