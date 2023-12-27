<template>
    <slot v-if="error" name="error">
        <span>{{ error }}</span>
    </slot>
    <slot v-else-if="pending" name="pending">
        <q-skeleton :type="skeletonType" />
    </slot>
    <slot v-else-if="data" />
</template>

<script lang="ts" setup generic="T">
import type { _AsyncData } from 'nuxt/dist/app/composables/asyncData'
import { FetchError } from 'ofetch'
import type { QSkeleton } from 'quasar'

const props = defineProps<{
    fetched: _AsyncData<T, FetchError | null>,
    skeletonType?: QSkeleton['type']
}>()

const error = computed<string | null>(() => {
    const error = props.fetched.error
    if (!error.value) {
        return null
    }

    if (error.value.statusCode === 404) {
        return 'Not found'
    }

    if (error.value.statusCode === 401) {
        return 'Unauthorized'
    }

    return 'An error occurred'
})

const data = props.fetched.data
const pending = props.fetched.pending

const skeletonType = computed(() => props.skeletonType ?? 'rect')

// interface FetchedData {
//     fetched: AsyncData<unknown, FetchError>,
// }

// interface RawData {
//     raw: unknown
// }

// const props = defineProps<FetchedData | RawData>()

// const isRaw = typeof props.raw !== 'undefined'
// const isFetched = typeof props.fetched !== 'undefined'

// const error = computed<string | null>(() => {
//     if (isRaw) {
//         const raw = props.raw
//         if (typeof raw === 'undefined' || raw === null) {
//             return 'An error occurred'
//         }
//     } else if (isFetched) {
//         const error = props.fetched.error
//         if (!error.value || !(error.value instanceof FetchError)) {
//             return 'An error occurred'
//         }

//         if (error.value.statusCode === 404) {
//             return 'Not found'
//         }
//     }

//     return null
// })

// const data = computed(() => {
//     if (isRaw) {
//         return props.raw
//     } else if (isFetched) {
//         return props.fetched.data
//     }
//     return null
// })

// const pending = computed(() => {
//     if (isRaw) {
//         return false
//     } else if (isFetched) {
//         return props.fetched.pending
//     }
//     return null
// })
</script>
