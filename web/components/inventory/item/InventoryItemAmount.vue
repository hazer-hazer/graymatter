<template>
    <div>
        <q-badge rounded color="primary" class="text-caption" :label="label" />
        <q-tooltip>{{ verboseAmount }}</q-tooltip>
    </div>
</template>

<script lang="ts" setup>
import type { AmountUnit } from '~/models/inventory/AmountUnit'

export interface IInventoryItemAmount {
    unit: AmountUnit
    value: bigint,
}

const { amount } = defineProps<{
    amount: IInventoryItemAmount
}>()

// const amount = {
//     unit: {
//         id: 123,
//         name: 'Pieces (quantity)',
//         symbol: 'pcs',
//         power_prefixes: {
//             [24]: { name: 'yotta', prefix: 'Y' },
//             [21]: { name: 'zetta', prefix: 'Z' },
//             [18]: { name: 'exa', prefix: 'E' },
//             [15]: { name: 'peta', prefix: 'P' },
//             [12]: { name: 'tera', prefix: 'T' },
//             [9]: { name: 'giga', prefix: 'G' },
//             [6]: { name: 'mega', prefix: 'M' },
//             [3]: { name: 'kilo', prefix: 'k' },
//             [2]: { name: 'hecto', prefix: 'h' },
//             [-1]: { name: 'deci', prefix: 'd' },
//             [-2]: { name: 'centi', prefix: 'c' },
//             [-3]: { name: 'milli', prefix: 'm' },
//             [-6]: { name: 'micro', prefix: 'mu' },
//             [-9]: { name: 'nano', prefix: 'n' },
//             [-12]: { name: 'pico', prefix: 'p' },
//             [-15]: { name: 'femto', prefix: 'f' },
//             [-18]: { name: 'atto', prefix: 'a' },
//             [-21]: { name: 'zepto', prefix: 'z' },
//             [-24]: { name: 'yotto', prefix: 'y' },
//         },
//     },
//     value: 19,
// }

const formatNumberWithPrefix = (n: bigint, _prefixes: typeof amount['unit']['powerPrefixes']): string => {
    // todo
    return n.toString()
}

const label = `${formatNumberWithPrefix(BigInt(amount.value), amount.unit.powerPrefixes)}${amount.unit.symbol}`
const verboseAmount = `${amount.value} ${amount.unit.name}`
</script>

<style lang="scss" scoped></style>
