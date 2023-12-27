import type { UnwrapNestedRefs } from 'vue'

// DELETE: Useless

export interface ComputedReactive<T> {
    get(): T
    set(val: T): T

    value: UnwrapNestedRefs<T>
    recompute(): T
}

export function computedReactive<T extends object> (recompute: () => T): ComputedReactive<T> {
    return {
        value: reactive<T>(recompute()),
        recompute,

        get () {
            return toValue(this.value)
        },

        set (val: T): T {
            Object.assign(this.value, val)
            return this.get()
        },
    }
}
