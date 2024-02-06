<template>
    <q-input
        v-model="value"
        :readonly="!amountUnit"
        type="number"
        label="Amount"
        outlined
        class="text-subtitle1 text-right cursor-pointer"
        :shadow-text="amountUnit?.symbol"
        lazy-rules
        autofocus
    />
</template>

<script setup lang="ts">
import type { AmountUnit } from '~/models/inventory/AmountUnit'

const props = defineProps<{
    amountUnit?: AmountUnit | null,
    modelValue?: number | null,
}>()

const emit = defineEmits<{
    'update:modelValue': [value: number | null],
}>()

const amountUnit = toRef(props, 'amountUnit')

const value = computed<string>({
    get () {
        return props.modelValue?.toString() ?? ''
    },
    set (val: string) {
        const amount = val.length ? Number(val) : null
        emit('update:modelValue', amount)
    },
})

</script>
