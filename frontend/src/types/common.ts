export type AnyFunc = (...args: any[]) => any

export interface NameWithFlagAttrs {
    name: string,
    crest_url: string,
}

type RecordKey = number | string | symbol;
export type EnumRecord<EnumT extends RecordKey, ValueT> = Partial<Record<EnumT, ValueT>>
