<template>
    <q-select
        v-model="model"
        label="Amount unit"
        :options="options"
        :option-value="(amountUnit: AmountUnit) => amountUnit"
        :option-label="(amountUnit: AmountUnit) => `${amountUnit.name} (${amountUnit.symbol})`"
        use-input
        @filter="filter"
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

const props = defineProps<{
    modelValue: AmountUnit | null
}>()

const emit = defineEmits<{
    'update:modelValue': [unit: AmountUnit | null],
}>()

const model = computed({
    get () {
        return props.modelValue
    },
    set (val: AmountUnit | null) {
        emit('update:modelValue', val)
    },
})

const { $apiUseFetch } = useNuxtApp()

const options = ref<AmountUnit[]>()
const filter: QSelect['onFilter'] = (_val, update) => {
    if (options.value) {
        update(() => {})
        return
    }

    const { data } = $apiUseFetch<{
        amountUnits: AmountUnit[]
    }>('inventory/amount')

    if (data.value) {
        update(() => {
            options.value = data.value?.amountUnits
        })
    }
}

</script>
