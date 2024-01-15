export type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
    ? Acc[number]
    : Enumerate<N, [...Acc, Acc['length']]>

export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>

export type AtLeastOneOf<O extends object, K extends string> = 
    | (K extends keyof O ? { [P in K]: O[P] } & O : O)
    | { [P in keyof O as P extends K ? K : never]-?: O[P] } & O


// Note: Do not use in schemas cause of problems with $ref encoding for types with generics
export type Refine<T, R extends keyof T = never, O extends keyof T = never> =
    Omit<T, R | O>
    & Required<Pick<T, R>>
    & Partial<Pick<T, O>>
