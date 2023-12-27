<template>
    <q-input
        v-model="price"
        type="number"
        label="Price"
        prefix="$"
        outlined
        hide-bottom-space
        :rules="[
            val => /(\d(\.\d+)?)?/.test(val) || 'Price must be a number'
        ]"
    />
</template>

<script setup lang="ts">
const props = defineProps<{
    modelValue?: number | null
}>()

const emit = defineEmits<{
    'update:modelValue': [value: number | null]
}>()

const price = computed<string>({
    get () {
        return props.modelValue?.toString() ?? ''
    },
    set (val: string) {
        const price = !val.length ? null : Number(val)
        emit('update:modelValue', price)
    },
})

</script>
