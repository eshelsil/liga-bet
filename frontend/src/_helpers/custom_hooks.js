import {useRef} from 'react';

export const useOnce = (callback) => {
    const hasBeenCalled = useRef(false);
    if (hasBeenCalled.current) return;
    callback();
    hasBeenCalled.current = true;
}