<template>
    <div>
        <q-badge :label="stockPrice" />
        <q-tooltip>{{ priceTooltip }}</q-tooltip>
    </div>
</template>

<script lang="ts" setup>
import type { IInventoryItemAmount } from './InventoryItemAmount.vue'

export interface IInventoryItemPrice {
    amount: IInventoryItemAmount;
    currency: {
        symbol: string;
    }
    value: bigint;
}

const { price } = defineProps<{
    price: IInventoryItemPrice
}>()

const stockPrice = `${price.value * price.amount.value}${price.currency.symbol}`
const priceTooltip = `${price.value}${price.currency.symbol} per ${price.amount.unit.symbol}`
</script>
