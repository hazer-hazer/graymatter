<template>
    <q-tooltip
        class="bg-transparent q-pa-none"
        :anchor="anchor"
        :self="self"
        :offset="offset"
        transition-show="scale"
        transition-hide="scale"
        transition-duration="200"
    >
        <q-badge transparent color="grey-8" class="edit-badge">
            <q-icon :name="props.icon" color="white" class="col" size="xs" />
        </q-badge>
    </q-tooltip>
</template>

<script setup lang="ts">
import type { QTooltip } from 'quasar'

export type BadgeTooltipPosition = 'before' | 'after' | 'default'

const props = withDefaults(defineProps<{
    icon?: string
    position?: BadgeTooltipPosition
}>(), {
    icon: 'edit',
    position: 'default',
})

const anchor = computed<QTooltip['anchor']>(() => {
    if (props.position === 'before') {
        return 'center left'
    }
    if (props.position === 'after') {
        return 'center right'
    }

    return 'top right'
})

const self = computed<QTooltip['self']>(() => {
    if (props.position === 'before') {
        return 'center right'
    }
    if (props.position === 'after') {
        return 'center left'
    }
})

const offset = computed<QTooltip['offset']>(() => {
    if (props.position === 'before') {
        return [5, 0]
    }
    if (props.position === 'after') {
        return [-5, 0]
    }
    return [0, 15]
})
</script>

<style lang="scss" scoped>
.edit-badge {
    width: 30px;
    height: 30px;
    line-height: 30px;
    border-radius: 50%;
}
</style>
