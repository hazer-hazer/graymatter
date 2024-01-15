// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function chunk<T> (arr: T[], chunkSize: number, options: {
    trailing: 'start' | 'end'
} = {
    trailing: 'end',
}): T[][] {
    // TODO: Trailing if needed
    return arr.reduce((chunks: T[][], el, index) => {
        const chunkIndex = Math.floor(index / chunkSize)
        chunks[chunkIndex] ??= []
        chunks[chunkIndex].push(el)
        return chunks
    }, [])
}

export function pick<T, K extends keyof T> (obj: T, ...keys: K[]): Pick<T, K> {
    return Object.fromEntries(keys.map(key => [key, obj[key]])) as Pick<T, K>
}

export function assignPicked<T extends {}, K extends keyof T, V extends T[K]> (obj: T, keys: K[], val: V) {
    keys.forEach((key) => { obj[key] = val })
}

export function mapValuesToDefault<T extends {}, K extends keyof T, M> (obj: T, def: M): Record<K, M> {
    return Object.fromEntries(Object.keys(obj).map(key => [key, def])) as Record<K, M>
}

export function mapValues<
    T extends {},
    K extends keyof T,
    R extends Record<K, unknown>
> (obj: T, map: ((map: T[K]) => R[K])): Record<K, R[K]> {
    return Object.fromEntries(Object.keys(obj).map(key => [key as K, map(obj[key as K])])) as Record<K, R[K]>
}

export function shallowDiff<T extends {}, K extends keyof T> (obj1: T, obj2: T): Record<K, boolean> {
    return Object.fromEntries(Object.keys(obj1).map(key => [
        key,
        obj1[key as K] !== obj2[key as K],
    ])) as Record<K, boolean>
}

export function mapIdList<
    T extends object,
    IdField extends keyof T,
    Id extends T[IdField] & (string | number)
> (list: T[], id: IdField | ((obj: T) => Id)): Record<Id, T>;

export function mapIdList<
    T extends object,
    IdField extends keyof T,
    Id extends T[IdField] & (string | number),
    R
> (list: T[], id: IdField | ((obj: T) => Id), map: ((obj: T) => R) | Exclude<R, Function>): Record<Id, R>;

export function mapIdList<
    T extends object,
    IdField extends keyof T,
    Id extends T[IdField] & (string | number),
    R
> (list: T[], id: IdField | ((obj: T) => Id), map: Exclude<R, Function>): Record<Id, R>;

export function mapIdList<
    T extends object,
    IdField extends keyof T,
    Id extends T[IdField] & (string | number),
    R
> (list: T[], id: IdField | ((obj: T) => Id), map: ((obj: T) => R)): Record<Id, R>;

export function mapIdList<
    T extends object,
    IdField extends keyof T,
    Id extends T[IdField] & (string | number),
    R
> (list: T[], id: IdField | ((obj: T) => Id), map?: ((obj: T) => R) | Exclude<R, Function>): Record<Id, R> {
    const mapId = typeof id === 'function' ? id : (el: T) => el[id]
    const mapVal = (map instanceof Function) ? map : (el: T) => (map ?? el)

    return Object.fromEntries(list.map(el => [mapId(el), mapVal(el)]))
}
