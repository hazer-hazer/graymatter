<template>
    <q-select
        v-model="model"
        label="Amount unit"
        :options="options"
        :option-value="(amountUnit: AmountUnit) => amountUnit"
        :option-label="(amountUnit: AmountUnit) => `${amountUnit.name} (${amountUnit.symbol})`"
        outlined
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

const { $apiFetch } = useNuxtApp()

const options = ref<AmountUnit[]>()
const filter: QSelect['onFilter'] = async (_val, update) => {
    if (options.value) {
        update(() => {})
        return
    }

    const { amountUnits } = await $apiFetch<{
        amountUnits: AmountUnit[]
    }>('inventory/amount')

    update(() => {
        options.value = amountUnits
    })
}

</script>
