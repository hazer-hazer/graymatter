<template>
    <div :class="`no-wrap flex-center text-subtitle2 ${blockClass}`">
        <q-separator class="col self-center" :vertical="vertical" />
        <div class="col-auto" :class="textClass">
            <slot>
                {{ label }}
            </slot>
        </div>
        <q-separator class="col self-center" :vertical="vertical" />
    </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
    label?: string,
    vertical?: boolean,
    full?: boolean,
}>(), {
    label: 'or',
    vertical: false,
    full: false,
})

const blockClass = computed(() => {
    if (props.vertical) {
        return 'column q-px-xs'
    }
    return 'row q-py-xs'
})

const textClass = computed(() => {
    if (!props.full) {
        return props.vertical ? 'q-py-sm' : 'q-px-sm'
    }
    return ''
})
</script>
