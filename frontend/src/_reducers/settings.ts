import { keysOf } from '@/utils';
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'



const storeSettings = (settings: State) => {
    localStorage.setItem('LigaBetAppSettings', JSON.stringify(settings));
}

const getStoredSettings = (): Partial<State> => {
    const settings = localStorage.getItem('LigaBetAppSettings')
    if (settings){
        try {
            return JSON.parse(settings) as Partial<State>;
        } catch (e){
            console.warn('Failed to parse local settings');
        }
    }
    return {}
}

const defaultSettings = {nihusim: true}

const getInitialSettings = (): State => {
    const res = defaultSettings as State;
    const stored = getStoredSettings();
    for (const key of keysOf(stored)){
        res[key] = stored[key];
    }
    return res;
}

interface State {
    nihusim?: boolean
}

const settings = createSlice({
    name: 'settings',
    initialState: getInitialSettings(),
    reducers: {
        update: (state, action: PayloadAction<Partial<State>>) => {

            const newSettings = {
                ...state,
                ...action.payload,
            }
            storeSettings(newSettings);
            return newSettings;
        },
    },
})

export default settings
