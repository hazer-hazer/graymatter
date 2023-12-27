<template>
    <q-input
        v-model="value"
        type="text"
        :label="attr?.name ?? 'Please, select attribute'"
        reactive-rules
        :rules="rules"
        :readonly="!attr"
        hide-bottom-space
    />
</template>

<script setup lang="ts">
import type { QInput } from 'quasar'
import type { Attribute } from '~/models/inventory/Attribute'

const props = defineProps<{
    modelValue: string | null
    attr: Attribute | null
}>()

const emit = defineEmits<{
    'update:modelValue': [val: string | null]
}>()

// TODO: Autocomplete of allowedValues?

const value = computed<string | null>({
    get () {
        return props.modelValue
    },
    set (val: string | null) {
        emit('update:modelValue', val?.length ? val : null)
    },
})

const rules = computed<QInput['rules']>(() => {
    const attr = props.attr

    if (!attr) {
        return []
    }

    if (attr.type === 'String') {
        return [val => !!val?.length]
    }

    if (attr.type === 'Enum') {
        return [val => !!val?.length && attr?.allowedValues?.includes(val)]
    }

    return []
})
</script>
