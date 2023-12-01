<template>
    <q-select
        v-model="model"
        label="Amount unit"
        :options="data?.amountUnits"
        :option-value="(amountUnit: AmountUnit) => amountUnit"
        :option-label="(amountUnit: AmountUnit) => `${amountUnit.name} (${amountUnit.symbol})`"
        use-input
    >
        <template #no-option>
            <q-item>
                <q-item-section class="text-grey">
                    No such amount unit
                </q-item-section>
            </q-item>
        </template>
    </q-select>
</template>

<script lang="ts" setup>
import type { QSelect } from 'quasar'
import type { AmountUnit } from '~/models/inventory/AmountUnit'

const { $apiUseFetch } = useNuxtApp()
const { data } = $apiUseFetch<{
    amountUnits: AmountUnit[]
}>('inventory/amount')

const model = ref<AmountUnit>()

defineExpose({
    selected: model,
})

</script>
