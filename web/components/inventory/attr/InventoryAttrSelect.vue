<template>
    <q-select
        v-model="attr"
        :options="options"
        option-label="name"
        :loading="pending"
        label="Attribute"
        outlined
        use-input
        :input-debounce="500"
    />
</template>

<script setup lang="ts">
import type { Attribute } from '~/models/inventory/Attribute'

const props = defineProps<{
    modelValue: Attribute | null,
    filter?:(attr: Attribute) => boolean,
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

const options = computed(() => {
    if (props.filter) {
        return data.value?.attrs.filter(props.filter)
    }
    return data.value?.attrs
})
</script>
