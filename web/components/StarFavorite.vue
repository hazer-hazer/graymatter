<template>
    <q-btn
        class="star"
        :icon="icon"
        :color="star ? 'yellow' : 'dark'"
        flat
        dense
        @click="star = !star"
    />
</template>

<script setup lang="ts">
const props = defineProps<{
    modelValue: boolean
}>()

const emit = defineEmits<{
    'update:modelValue': [val: boolean]
}>()

const star = computed({
    get () {
        return props.modelValue
    },
    set (val: boolean) {
        emit('update:modelValue', val)
    },
})

const icon = computed(() => props.modelValue ? 'star' : 'star_outline')
</script>

<style lang="scss">
.star {
    cursor: pointer;
    transition: color .15s ease;

    &.active {
        color: $yellow;
    }

    &:hover {
        color: $yellow;
    }

    &.active:hover {
        color: $dark;
    }
}
</style>
