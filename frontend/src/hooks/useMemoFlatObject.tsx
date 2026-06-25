import { useMemo } from 'react';

type primitive = string | number | symbol | boolean | undefined | null;
type FlatObject = { [key: string | number]: primitive };
type FlatArray = primitive[];

function useMemoFlatObject<T extends FlatObject | FlatArray>(obj: T): T {
    const objAsJson = JSON.stringify(obj);
    const memoizedIdsToFetch = useMemo(() => JSON.parse(objAsJson) as T, [objAsJson]);
    return memoizedIdsToFetch;
}

export default useMemoFlatObject;
