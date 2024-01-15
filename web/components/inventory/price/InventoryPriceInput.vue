<template>
    <q-input
        v-model="price"
        type="number"
        label="Price"
        :prefix="currency.symbol"
        outlined
        hide-bottom-space
        :rules="[
            val => /(\d(\.\d+)?)?/.test(val) || 'Price must be a number'
        ]"
    />
</template>

<script setup lang="ts">
import type { Currency } from '~/models/Currency'

const props = defineProps<{
    modelValue?: number | null
    currency: Currency
}>()

const emit = defineEmits<{
    'update:modelValue': [value: number | null]
}>()

const price = computed<string>({
    get () {
        return props.modelValue?.toString() ?? ''
    },
    set (val: string) {
        if (!val.length) {
            emit('update:modelValue', null)
            return
        }
        const [int, frac] = val.split('.')
        const fracStr = frac ? `.${frac.slice(0, props.currency.decimals)}` : ''
        emit('update:modelValue', Number(`${int}${fracStr}`))
    },
})

</script>
