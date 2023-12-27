<template>
    <q-select
        v-model="attr"
        :options="data?.attrs"
        option-label="name"
        :loading="pending"
        label="Attribute"
        outlined
        use-input
        hide-bottom-space
        :input-debounce="500"
    />
</template>

<script setup lang="ts">
import type { Attribute } from '~/models/inventory/Attribute'

const props = defineProps<{
    modelValue: Attribute | null
}>()

const emit = defineEmits<{
    'update:modelValue': [val: Attribute | null]
}>()

const attr = computed({
    get () {
        return props.modelValue
    },
    set (val: Attribute | null) {
        emit('update:modelValue', val)
    },
})

const { $apiUseFetch } = useNuxtApp()

const { data, pending } = await $apiUseFetch<{
    attrs: Attribute[]
}>('/inventory/attr/my', {
    method: 'GET',
})
</script>
