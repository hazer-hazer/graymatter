<template>
    <q-input v-model="uri" type="text" :label="label ?? 'Short name'" />
</template>

<script lang="ts" setup>
import { nameToUri } from '~/utils/format'

const {
    modelValue,
    nameValue,
    label,
} = defineProps<{
    modelValue?: string,
    nameValue?: string,
    label?: string
}>()

const emit = defineEmits<{
    'update:modelValue': [value: string]
}>()

const uri = computed({
    get () {
        if (!modelValue?.length && nameValue) {
            return nameToUri(nameValue)
        }
        return modelValue ?? ''
    },
    set (value: string) {
        emit('update:modelValue', value)
    },
})

</script>
