import { AppDispatch, GetRootState } from '../_helpers/store';

export type AnyFunc = (...args: any[]) => any

export type AsyncAction = (dispatch: AppDispatch, getState: GetRootState) => Promise<any>

export interface NameWithFlagAttrs {
    name: string,
    crest_url: string,
}

export type RecordKey = number | string | symbol;
export type EnumRecord<EnumT extends RecordKey, ValueT> = Partial<Record<EnumT, ValueT>>
