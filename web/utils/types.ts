export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
export type XOR<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;
export type NonFunction<T> = T extends Function ? never : T

export type Refine<T, R extends keyof T = never, O extends keyof T = never> =
    Omit<T, R | O>
    & Required<Pick<T, R>>
    & Partial<Pick<T, O>>
