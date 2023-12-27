<template>
    <q-tooltip
        class="bg-transparent q-pa-none"
        anchor="top right"
        :offset="[0, 15]"
        transition-show="scale"
        transition-hide="scale"
        transition-duration="200"
    >
        <q-badge transparent color="grey-8" class="edit-badge row text-body1">
            <q-icon :name="props.icon" color="white" class="col" />
        </q-badge>
    </q-tooltip>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
    icon?: string
}>(), {
    icon: 'edit',
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
