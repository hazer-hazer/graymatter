export type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
    ? Acc[number]
    : Enumerate<N, [...Acc, Acc['length']]>

export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>

export type AtLeastOneOf<O extends object, K extends string> = 
    | (K extends keyof O ? { [P in K]: O[P] } & O : O)
    | { [P in keyof O as P extends K ? K : never]-?: O[P] } & O
