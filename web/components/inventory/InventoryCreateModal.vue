<template>
    <g-modal v-model="confirm" title="New inventory" :loading="loading" @submit="onSubmit">
        <q-input v-model="name" type="text" label="Inventory name" />
        <q-input v-model="description" type="text" label="Description" />
        <q-input v-model="uri" type="text" label="Shortname" />
    </g-modal>
</template>

<script lang="ts" setup>
import type { Inventory } from '~/models/inventory/Inventory'

const props = defineProps<{
    modelValue: boolean
}>()

const emit = defineEmits<{
    'update:modelValue': [val: boolean]
}>()

const confirm = computed({
    get () {
        return props.modelValue
    },
    set (val) {
        emit('update:modelValue', val)
    },
})

const loading = ref<boolean>(false)
const name = ref<string>()
const description = ref<string>()
const uri = ref<string>()

const { $apiFetch } = useNuxtApp()

const onSubmit = async () => {
    loading.value = true
    const result = await $apiFetch<{
        inventory: Inventory
    }>('/inventory', {
        method: 'POST',
        body: {
            name: name.value,
            description: description.value,
            uri: uri.value,
        },
    })
    loading.value = false

    navigateTo(`/inventory/${result.inventory.uri}`)
}
</script>
