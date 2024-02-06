<template>
    <q-select
        v-model="model"
        label="Amount unit"
        :options="options"
        :option-value="(amountUnit: AmountUnit) => amountUnit"
        :option-label="(amountUnit: AmountUnit) => `${amountUnit.symbol} (${amountUnit.name})`"
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

const { $apiUseFetch } = useNuxtApp()

const { data: amountUnits } = await $apiUseFetch<{
    amountUnits: AmountUnit[]
}>('inventory/amount')

const defaultAmountUnit = computed(() => amountUnits.value?.amountUnits.find(unit => !!unit.default) ?? null)

const model = computed({
    get () {
        return props.modelValue
    },
    set (val: AmountUnit | null) {
        emit('update:modelValue', val)
    },
})

watchEffect(() => {
    if (defaultAmountUnit.value && !props.modelValue) {
        model.value = defaultAmountUnit.value
    }
})

const options = ref<AmountUnit[]>()
const filter: QSelect['onFilter'] = (input_, update) => {
    const input = input_.toLocaleLowerCase()

    update(() => {
        options.value = amountUnits.value?.amountUnits.filter(unit =>
            unit.name.toLocaleLowerCase().includes(input) ||
            unit.symbol.toLocaleLowerCase().includes(input))
    })
}

</script>
